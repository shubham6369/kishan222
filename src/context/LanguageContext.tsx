'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface Dictionary {
  nav: {
    home: string;
    features: string;
    mission: string;
    marketplace: string;
    join: string;
    login: string;
    tagline: string;
    about: string;
    contact: string;
    dashboard: string;
    signout: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta_join: string;
    cta_marketplace: string;
    trust: string;
  };
  features: {
    title: string;
    subtitle: string;
    cards: {
      card: { title: string; desc: string };
      market: { title: string; desc: string };
      referral: { title: string; desc: string };
    };
  };
  cart: {
    title: string;
    empty: string;
    empty_subtitle: string;
    explore: string;
    summary: string;
    subtotal: string;
    delivery: string;
    total: string;
    proceed: string;
    items_count: string;
    free: string;
    taxes_notice: string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    search_placeholder: string;
    no_results: string;
    add_to_cart: string;
    view_details: string;
    organic_label: string;
    filters: string;
    season: string;
    featured: string;
    showing: string;
    results: string;
    categories: {
      all: string;
      seeds: string;
      fertilizers: string;
      pesticides: string;
      cattle: string;
      fresh: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    reach_out: string;
    phone: string;
    email: string;
    visit: string;
    visit_address: string;
    form_name: string;
    form_email: string;
    form_subject: string;
    form_message: string;
    form_submit: string;
    faqs_title: string;
  };
  about: {
    story_tag: string;
    hero_title: string;
    hero_subtitle: string;
    mission_tag: string;
    mission_title: string;
    mission_p1: string;
    mission_p2: string;
    join_movement: string;
    stats: {
      active: string;
      farmers: string;
      products: string;
      districts: string;
    };
    pillars_title: string;
    pillars_subtitle: string;
    pillars: {
      organic: { title: string; desc: string };
      protection: { title: string; desc: string };
      community: { title: string; desc: string };
      gaushala: { title: string; desc: string };
    };
    milestones_title: string;
    milestones_subtitle: string;
    team_title: string;
    team_subtitle: string;
    cta_title: string;
    cta_desc: string;
    cta_get_card: string;
    cta_contact: string;
  };
  footer: {
    legal: string;
    established: string;
    mission: string;
    exploration: string;
    exploration_links: string[];
    intelligence: string;
    intelligence_links: string[];
    assistance: string;
    support_hours: string;
    digital_support: string;
    privacy: string;
    terms: string;
    ethics: string;
    links: {
      privacy: string;
      terms: string;
      refunds: string;
      shipping: string;
    };
  };
  checkout: {
    title: string;
    shipping_address: string;
    full_name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    your_order: string;
    subtotal: string;
    delivery: string;
    total: string;
    pay_button: string;
    processing: string;
    secure_payment: string;
    login_prompt: string;
    order_desc: string;
    sdk_failed: string;
    order_failed: string;
    checkout_error: string;
    payment_failed: string;
    payment_error: string;
  };
  login: {
    title: string;
    subtitle: string;
    method_otp: string;
    method_password: string;
    phone_label: string;
    phone_placeholder: string;
    send_otp: string;
    verify_otp: string;
    otp_label: string;
    otp_placeholder: string;
    password_label: string;
    password_placeholder: string;
    signin: string;
    no_account: string;
    register: string;
    badge: string;
    otp_sent_to: string;
    change: string;
    forgot: string;
    phone_or_email: string;
    phone_or_email_placeholder: string;
    error_phone: string;
    error_otp: string;
    error_creds: string;
  };
  forgot: {
    title: string;
    subtitle: string;
    phone_label: string;
    send_otp: string;
    verify_otp: string;
    new_passcode: string;
    new_passcode_placeholder: string;
    reset_button: string;
    success_title: string;
    success_desc: string;
    back_login: string;
  };
  register: {
    title: string;
    subtitle: string;
    benefit_verified: string;
    benefit_schemes: string;
    benefit_referral: string;
    steps: {
      identity: string;
      farming: string;
      security: string;
      payment: string;
      card: string;
    };
    success_title: string;
    success_desc: string;
    print_card: string;
    referral_link_label: string;
    go_dashboard: string;
    mobile_verification: string;
    mobile_desc: string;
    full_name: string;
    full_name_placeholder: string;
    phone_number: string;
    phone_placeholder: string;
    enter_otp: string;
    otp_placeholder: string;
    farming_profile: string;
    farming_desc: string;
    upload_photo: string;
    village: string;
    village_placeholder: string;
    district: string;
    district_placeholder: string;
    crops: string;
    crops_placeholder: string;
    land_size: string;
    land_size_placeholder: string;
    set_passcode: string;
    passcode_desc: string;
    secret_passcode: string;
    passcode_placeholder: string;
    membership_fee: string;
    fee_desc: string;
    lifelong_card: string;
    total_amount: string;
    back: string;
    continue: string;
    send_otp: string;
    verify_otp: string;
    pay_securely: string;
    errors: {
      photo_size: string;
      invalid_otp: string;
      valid_otp_6: string;
      payment_failed: string;
      payment_cancelled: string;
      valid_name_phone: string;
      phone_registered: string;
      otp_send_failed: string;
      farming_details: string;
      passcode_min: string;
      payment_init_failed: string;
      session_lost: string;
      link_copied: string;
    };
    payment_desc: string;
    member_type_farmer: string;
    card: {
      official_member: string;
      acres: string;
      issued: string;
      expires: string;
    };
  };
  auth: {
    resend_otp: string;
    wait_resend: string;
    change_number: string;
    error_phone: string;
    error_otp: string;
  };
  dashboard: {
    title: string;
    jai_kisan: string;
    farmer: string;
    welcome: string;
    premium_member: string;
    stats: {
      earnings: string;
      referrals: string;
      listings: string;
      today: string;
      lifetime: string;
      live_now: string;
    };
    identity: {
      title: string;
      desc: string;
      download: string;
      share: string;
    };
    referrals: {
      title: string;
      subtitle: string;
      view_all: string;
      loading: string;
      none: string;
      earned: string;
      joined: string;
      recently: string;
      unknown: string;
    };
    wallet: {
      title: string;
      balance: string;
      withdraw: string;
      min_fee: string;
      withdraw_msg: string;
    };
    referral_box: {
      title: string;
      subtitle: string;
      link_label: string;
      copied: string;
    };
    support: {
      title: string;
      expert: string;
      market: string;
    };
    payments: {
      title: string;
      subtitle: string;
      successful: string;
      pending: string;
      failed: string;
      loading: string;
      none: string;
      order_id: string;
      amount: string;
      date: string;
      status: string;
      action: string;
    };
  };
  sidebar: {
    overview: string;
    my_card: string;
    marketplace: string;
    seller_hub: string;
    my_products: string;
    referrals: string;
    payments: string;
    wallet: string;
    surplus_title: string;
    surplus_desc: string;
    sell_now: string;
    logout: string;
    portal: string;
    brand: string;
  };
}

interface LanguageContextType {
  lang: string;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  lang, 
  dict 
}: { 
  children: ReactNode; 
  lang: string; 
  dict: Dictionary;
}) {
  return (
    <LanguageContext.Provider value={{ lang, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

