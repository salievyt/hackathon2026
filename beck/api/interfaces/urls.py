from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BrandBookView,
    ConfigView,
    FaqListView,
    I18nView,
    MemberListView,
    ParticipantViewSet,
    PartnerLeadCreateView,
    PartnerLoginView,
    PartnerMeView,
    PartnerListView,
    PartnerSectionView,
    TrackListView,
)

router = DefaultRouter()
router.register(r'participants', ParticipantViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('config/', ConfigView.as_view(), name='site-config'),
    path('i18n/<str:locale>/', I18nView.as_view(), name='i18n-messages'),
    path('tracks/', TrackListView.as_view(), name='track-list'),
    path('mentors/', MemberListView.as_view(), kwargs={'category': 'mentor'}, name='mentor-list'),
    path('jury/', MemberListView.as_view(), kwargs={'category': 'jury'}, name='jury-list'),
    path('partners/', PartnerListView.as_view(), name='partner-list'),
    path('faq/', FaqListView.as_view(), name='faq-list'),
    path('brand-book/', BrandBookView.as_view(), name='brand-book'),
    path('partner-section/', PartnerSectionView.as_view(), name='partner-section'),
    path('partner-leads/', PartnerLeadCreateView.as_view(), name='partner-lead-create'),
    path('partner/login/', PartnerLoginView.as_view(), name='partner-login'),
    path('partner/me/', PartnerMeView.as_view(), name='partner-me'),
]
