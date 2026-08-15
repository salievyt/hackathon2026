"""Use cases for the landing content catalog."""

from api.models import (
    BrandBook,
    FaqItem,
    Member,
    Partner,
    PartnerAsset,
    PartnerPackage,
    PartnerSectionConfig,
    SiteConfig,
    Track,
)


def get_active_tracks():
    return Track.objects.filter(is_active=True)


def get_active_members(category):
    return Member.objects.filter(is_active=True, category=category)


def get_active_partners():
    return Partner.objects.filter(is_active=True)


def get_active_faq_items():
    return FaqItem.objects.filter(is_active=True)


def get_active_site_config():
    return SiteConfig.objects.first()


def get_brand_book():
    return BrandBook.objects.first()


def get_partner_section():
    return PartnerSectionConfig.objects.first()


def get_active_partner_packages():
    return PartnerPackage.objects.filter(is_active=True)


def get_partner_assets():
    return PartnerAsset.objects.all()
