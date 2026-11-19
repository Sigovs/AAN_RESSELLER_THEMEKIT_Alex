/* AAN · Staff UI · System Settings — GENERATION 11 · fixture

   Read from the new backend (newbackendcert, /admin/system-settings) on 2026-11-18, read only,
   at 1918px. Values are the live ones, with three deliberate omissions for a public repository:
   the AI API key is shown only as "•••• set" (never its prefix or length), the prod-import
   server is "server 3" (never its address), and the prompt is its first lines only.
   Where the read captured fewer entries than the backend holds (the former-staff picker,
   the unlisted crew, the module table, the Descriptions tokens) the real totals are kept
   and nothing is padded. */
window.SS = {
  read: 'Nov 18',

  /* ── Developer tools ── */
  devbar: {
    key: 'engine_system_settings → aan_developer_debugbar_users',
    active: 14,
    /* [name, staff #, note] — the note is the backend's own ("disabled login") */
    viewers: [
      ['Alex Sigoff', 612], ['Bill Simons', 57], ['Chris Jungheim', 72], ['Dmitriy Lebedev', 285],
      ['Ivaylo Guenkov', 1715], ['Jake Astigarraga', 2320, 'disabled login'], ['Karen Conrad', 2],
      ['Kirsten McFarland', 287], ['Matthew Jungheim', 1400], ['Max Hansen', 2139],
      ['Samantha McFarland', 630], ['Scott McFarland', 501], ['Sergey Bukreev', 1004], ['Tony McFarland', 36]
    ],
    pickActive: [['Anthony Labalestra', 462]],
    pickFormer: [
      ['Alex Belko', 1], ['Aliakbar Badshah', 1792], ['Chandrashekhar Singh', 1627], ['Claudiu Diaconeasa', 1704],
      ['Dan Moczisko', 1578], ['Darren Murray', 1521], ['David Bakalov', 1495]
    ],
    formerMore: true            /* the picker goes on past David Bakalov; the rest was not captured */
  },

  /* ── AI assistant ── */
  ai: {
    name: 'AI Description Generator',
    see: 'dealers.ai_description',
    egress: 'api.openai.com',
    live: true,
    credKey: 'engine_system_settings',
    model: 'gpt-5.6-terra',
    models: [
      ['gpt-5.6-terra', 'current — reasoning model, takes effort + verbosity'],
      ['gpt-4o', 'what the legacy system used'],
      ['gpt-4o-mini', 'cheapest, still good copy'],
      ['gpt-4.1', 'strong prose, no reasoning knobs'],
      ['o4-mini', 'reasoning model — slower, pricier']
    ],
    endpoint: 'responses',
    endpoints: [
      ['responses', 'Responses API', 'current; use this for gpt-5 and o-series', '/responses'],
      ['chat', 'Chat Completions', 'the older surface the legacy code used', '/chat/completions']
    ],
    effort: 'low',
    efforts: ["don't send it", 'none', 'low', 'medium', 'high', 'xhigh'],
    verbosity: 'high',
    verbosities: ["don't send it", 'low', 'medium', 'high'],
    words: [89, 136, 159],
    prompt: 'You are a senior automotive copywriter for a car dealership. You write the vehicle description that appears on the dealer\'s own website AND gets syndicated to third-party listing portals. Your copy has two jobs: sell THIS car to ITS buyer, and carry the keyword freight that makes the listing rank on those portals.\n\nSTEP 1 - READ THE CAR BEFORE WRITING A WORD. …',
    varsIntro: 'Grouped the way the vehicle page itself is grouped. A token whose value is empty…',
    /* [group, [[token, label, hint], …], more-not-captured] */
    vars: [
      ['Dealer info', [
        ['{dealer_name}', 'Dealership name', ''], ['{dealer_city}', 'City', 'e.g. "West Chicago"'],
        ['{dealer_state}', 'State', '"IL"'], ['{dealer_zip}', 'ZIP', '"60185"'],
        ['{dealer_address}', 'Street address', ''], ['{dealer_phone}', 'Phone', ''],
        ['{dealer_web}', 'Website', '"chicagomotorcars.com"']]],
      ['Vehicle · Vehicle Details', [
        ['{stockno}', 'Stock', ''], ['{vin}', 'VIN', ''], ['{year}', '', ''], ['{make}', '', ''],
        ['{model}', '', ''], ['{trim}', '', ''], ['{body}', '', ''], ['{mileage}', 'odometer', '(30,170)'],
        ['{engine}', '', ''], ['{trans}', 'Transmission', '"6-speed automatic"'],
        ['{mpg_cty}', 'MPG City', ''], ['{mpg_hwy}', 'MPG Hwy', ''],
        ['{certified}', 'Certified', '→ "Certified Pre-Owned" when ticked']]],
      ['Vehicle · Pricing', [
        ['{price}', '', ''], ['{discount_price}', '', ''], ['{lease_price}', '', ''], ['{lease_term}', '', '']]],
      ['Vehicle · Video', [['{YouTube_url}', 'walkaround video URL', '']]],
      ['Vehicle · Colors', [
        ['{ext_color}', '', '"Seneca Blue"'], ['{basic_ext_color}', '', '"Blue"'],
        ['{int_color}', '', ''], ['{basic_int_color}', '', '']]],
      ['Vehicle · Descriptions', [['{intro_text}', '', ''], ['{main_text_1}', '', '']], true],
      ['Everything at once', [
        ['{vehicle}', 'Year make model trim', '"2018 Isuzu NRR"'], ['{options}', 'Equipment and options', '']]],
      ['What the operator typed', [
        ['{special_notes}', 'Special Features box', ''], ['{tone}', 'Style/tone picker', '"Journalistic Style"']]]
    ],
    changed: { who: '', when: 'Jul 31, 2026 3:49 am', key: 'ai_description_*' }
  },

  /* ── Parity testing ── */
  parity: {
    tag: 'Temp — Phase 6',
    note: 'Temporary certification tooling on this clone. Not part of the production feature set.',
    on: false,
    label: 'Resolve missing dealer DBs from prod-import server 3 (read-only, staff only)',
    changed: { who: 'Ivaylo Guenkov (#1715)', when: 'Aug 12, 2026' }
  },

  /* ── Switch panorama — read-only · 17 switches ── */
  panorama: {
    note: 'Every live-vs-stub seam, cutover ownership row and secret-presence flag this environment runs with.',
    /* [seam, state, detail, key] — state: live | stub | log | on | value */
    seams: [
      ['Craigslist posting', 'stub', 'stages only', 'craigslist.live_posting'],
      ['LotVantage posting', 'stub', 'staged', 'posting.live'],
      ['eBay API', 'stub', 'canned', 'ebay.live'],
      ['AI descriptions (OpenAI)', 'live', 'completions', 'engine_system_settings → ai_description_enabled'],
      ['Carfax socket', 'stub', 'canned 500', 'carfax.driver'],
      ['Site provisioning', 'live', 'provisions', 'provisioning.live_provisioning'],
      ['Provisioning operations', 'live', 'operates', 'provisioning.live_operations'],
      ['Outbound mail', 'log', 'nothing delivered', 'mail.default'],
      ['Developer debug bar', 'on', '', 'devbar.enabled'],
      ['Dealer features cache', 'value', '10 min TTL', 'dealers.features_ttl_minutes']
    ],
    secrets: [
      ['Server-3 overlay password', 'parity_overlay.password'],
      ['AI assistant API key', 'engine_system_settings → ai_description_api_key'],
      ['json_tickets API key', 'tickets.json_api.key'],
      ['Auto-log token — main', 'sites.auto_log.token_main'],
      ['Auto-log token — Woo', 'sites.auto_log.token_woo']
    ],
    owners: [
      ['Front-door routing', 0, 18, 'cutover.modules'],
      ['Email delivery', 2, 11, 'side_effects.email_owner']
    ],
    modulesTotal: 22,
    /* [module, front door, email delivery] — the first rows of 22 */
    modules: [
      ['auth', 'not routed', 'newbackend'],
      ['locator', 'not routed', 'newbackend'],
      ['acclms', 'legacy', 'legacy'],
      ['autolocator', 'legacy', 'no send path']
    ],
    lists: [
      ['Ruled out', '410 Gone on both backends', 'cutover.ruled_out'],
      ['Frozen admin modules', 'always legacy', 'cutover.frozen_admin_modules'],
      ['Frozen CP paths', 'always legacy', 'cutover.frozen_cp_paths']
    ]
  },

  /* ── Crew roster ── */
  crew: {
    title: 'Ticket assignment roster',
    key: 'engine_system_settings → tickets_assignment_roster',
    total: 43,
    listed: ['Alex Sigoff', 'Aliakbar Badshah', 'Anthony Labalestra', 'Bill Simons', 'Chris Jungheim', 'Dmitriy Lebedev',
      'Husain Arif', 'Ivaylo Guenkov', 'Jake Astigarraga', 'Karen Conrad', 'Kirsten McFarland', 'Marshena Greene',
      'Matthew Jungheim', 'Max Hansen', 'New Guy', 'Nick Jungheim', 'Rahul Jain', 'Rashid Rangrej', 'Samantha McFarland',
      'Sergey Bukreev', 'Scott McFarland', 'Tony McFarland'],
    fixed: ['Client/Dealer', '3rd Party', 'Reseller', 'Other'],
    /* the read captured these 16 of the 21 unlisted; the other 5 are counted, not invented */
    unlisted: ['Alex Hernandez', 'Anis Kuzmis', 'Chandrashekhar Singh', 'Claudiu Diaconeasa', 'Dan Moczisko', 'Darren Murray',
      'David Bakalov', 'Gage OLaughlin', 'Gary Bernatonis', 'James Bregenzer', 'Kevin Martinez', 'Laura Hammer',
      'Marcus Davis', 'Max Kopych', 'Mike Verthein', 'Rafal Buzinski'],
    changed: { who: 'Ivaylo Guenkov (#1715)', when: 'Aug 7, 2026 11:02 pm' }
  },

  /* ── Store ledger — 11 keys ── */
  ledger: {
    store: 'aanreseller.engine_system_settings',
    /* [key, label, value, kind, last change] — kind: '' text · 'none' not set · 'secret' masked */
    rows: [
      ['aan_developer_debugbar_users', 'AAN developer users — debug bar viewers', '14 ids 2,36,57,72,285,287,501,612,…', '', 'Ivaylo Guenkov (#1715) · Jul 30, 2026'],
      ['ai_description_api_key', 'AI writing assistant — API key', '•••• set', 'secret', 'actor not recorded · Jul 30, 2026'],
      ['ai_description_base_url', 'AI writing assistant — endpoint', 'empty', 'none', 'actor not recorded · Jul 31, 2026'],
      ['ai_description_enabled', 'AI writing assistant — live', 'ON', '', 'actor not recorded · Jul 30, 2026'],
      ['ai_description_max_tokens', 'AI writing assistant — completion ceiling', '•••• hidden', 'secret', 'actor not recorded · Jul 31, 2026 3:37 am'],
      ['ai_description_model', 'AI writing assistant — model', 'gpt-5.6-terra', '', 'actor not recorded · Aug 20, 2026 5:54 pm'],
      ['ai_description_prompt', 'AI writing assistant — prompt', 'You are a senior automotive copywriter f…', '', 'Ivaylo Guenkov (#1715) · Aug 7, 2026 10:…'],
      ['ai_description_reasoning_effort', 'AI writing assistant — reasoning effort', 'low', '', 'actor not recorded · Jul 31, 2026 3:37 am'],
      ['ai_description_verbosity', 'AI writing assistant — verbosity', 'high', '', 'actor not recorded · Jul 31, 2026 3:37 am'],
      ['parity_remote_overlay_enabled', 'Server-3 read-only dealer-DB overlay', 'not set', 'none', 'Ivaylo Guenkov (#1715) · Aug 12, 2026'],
      ['tickets_assignment_roster', 'Ticket assignment roster', '22 ids 1,40,2,3,4,5,45,39,51,7,9,38,27,…', '', 'Ivaylo Guenkov (#1715) · Aug 7, 2026 11:02 pm']
    ]
  }
};
