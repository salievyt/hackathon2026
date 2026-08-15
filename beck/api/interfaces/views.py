from django.contrib.auth import authenticate
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from api.application.content import (
    get_active_faq_items,
    get_active_members,
    get_active_partners,
    get_active_site_config,
    get_active_tracks,
    get_brand_book,
    get_partner_section,
)
from api.domain.localization import build_message_tree, resolve_locale
from api.models import Member, Participant, PartnerLead, Translation

from .serializers import (
    BrandBookSerializer,
    FaqItemSerializer,
    MemberSerializer,
    ParticipantSerializer,
    PartnerLeadSerializer,
    PartnerMeSerializer,
    PartnerSectionSerializer,
    PartnerSerializer,
    SiteConfigSerializer,
    TrackSerializer,
)


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    @action(detail=False, methods=['get'])
    def count(self, request):
        return Response({'count': self.queryset.count()})


class PublicApiView(APIView):
    """Base view for public, read-only endpoints."""

    authentication_classes = []
    permission_classes = []

    def serializer_context(self, request):
        return {
            'locale': resolve_locale(request.query_params.get('locale')),
            'request': request,
        }


class I18nView(PublicApiView):
    def get(self, request, locale):
        locale = resolve_locale(locale)
        messages = build_message_tree(Translation.objects.filter(locale=locale))
        return Response({'locale': locale, 'messages': messages})


class TrackListView(PublicApiView):
    def get(self, request):
        serializer = TrackSerializer(
            get_active_tracks(),
            many=True,
            context=self.serializer_context(request),
        )
        return Response(serializer.data)


class MemberListView(PublicApiView):
    def get(self, request, category):
        if category not in (Member.CATEGORY_MENTOR, Member.CATEGORY_JURY):
            return Response(
                {'error': f'Unsupported category: {category}'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = MemberSerializer(
            get_active_members(category),
            many=True,
            context=self.serializer_context(request),
        )
        return Response(serializer.data)


class PartnerListView(PublicApiView):
    def get(self, request):
        serializer = PartnerSerializer(
            get_active_partners(),
            many=True,
            context=self.serializer_context(request),
        )
        return Response(serializer.data)


class FaqListView(PublicApiView):
    def get(self, request):
        serializer = FaqItemSerializer(
            get_active_faq_items(),
            many=True,
            context=self.serializer_context(request),
        )
        return Response(serializer.data)


class ConfigView(PublicApiView):
    def get(self, request):
        config = get_active_site_config()
        if not config:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        serializer = SiteConfigSerializer(config)
        return Response(serializer.data)


class BrandBookView(PublicApiView):
    def get(self, request):
        brand_book = get_brand_book()
        if not brand_book:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        serializer = BrandBookSerializer(
            brand_book,
            context=self.serializer_context(request),
        )
        return Response(serializer.data)


class PartnerSectionView(PublicApiView):
    def get(self, request):
        config = get_partner_section()
        if not config:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        serializer = PartnerSectionSerializer(
            config,
            context=self.serializer_context(request),
        )
        return Response(serializer.data)


class PartnerLeadCreateView(PublicApiView):
    def post(self, request):
        serializer = PartnerLeadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PartnerLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        user = authenticate(request, username=email, password=password)
        if user is None or not hasattr(user, 'partner_profile'):
            return Response(
                {'detail': 'Invalid credentials or not a partner account.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class PartnerMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(self._serialize(request))

    def patch(self, request):
        profile = getattr(request.user, 'partner_profile', None)
        partner = profile.partner if profile else None
        if partner is None:
            return Response(
                {'detail': 'No partner card linked to this account.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        for field in ('name', 'url', 'order'):
            if field in request.data:
                setattr(partner, field, request.data[field])
        if request.FILES.get('logo'):
            partner.logo = request.FILES['logo']
        partner.save()
        return Response(self._serialize(request))

    def _serialize(self, request):
        profile = getattr(request.user, 'partner_profile', None)
        lead = PartnerLead.objects.filter(
            contact_email=request.user.email,
        ).first()
        payload = {
            'email': request.user.email,
            'name': request.user.get_full_name() or request.user.username,
            'participant_count': Participant.objects.count(),
            'partner': profile.partner if profile else None,
            'lead': lead,
        }
        serializer = PartnerMeSerializer(
            payload,
            context=self.serializer_context(request),
        )
        return serializer.data

    def serializer_context(self, request):
        return {
            'locale': resolve_locale(request.query_params.get('locale')),
            'request': request,
        }
