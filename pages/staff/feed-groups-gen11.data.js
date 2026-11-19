/* AAN · Staff UI · Feed Groups — GENERATION 11 · fixture

   Read from the new backend (newbackendcert, /manage/feeds/groups) on 2026-11-18, read only.
   The list has 68 groups; this sample carries the first 30 rows as the backend lists them
   (ID order). Values are the live ones; nothing is invented.

   Not in the read, and therefore not shown as fact:
   · each group's On / Off state (the column is a switch per row; the switches start on and only
     switch here — the column head carries a Demo tag);
   · any group's stored settings (the editor opens a group with its name, type and on/off only);
   · the dealers a group is assigned to (the assignment panel shows its columns and says so);
   · the options of the selects the read did not open (Fields delimiter, the two Timestamp
     selects, Data lab, the mapping's DB field, the two selects of the advanced field setup).

   row = [id, group name, type] */
window.FG = {
  total: 68,
  read: '2026-11-18',
  rows: [
    [4, 'BuySellOrFind', 'all'], [5, 'GForces', 'all'], [6, 'MotorGT.com', 'all'], [7, 'DealerCue', 'all'],
    [9, 'CarGuruCanada', 'all'], [10, 'AutoAPR', 'all'], [11, 'AutoConX.com', 'all'], [12, 'Vast(Carfax)', 'all'],
    [13, 'JamesEdition', 'all'], [14, 'Autotrader_used', 'used'], [15, 'Autotrader_new', 'new'], [16, 'CarGuru', 'all'],
    [17, 'DriveChicago', 'all'], [18, 'Web2Carz', 'all'], [19, 'EBizAutos', 'all'], [20, 'Oodle', 'all'],
    [21, 'LotVantage', 'all'], [22, 'OpenLane', 'all'], [23, 'EBay Motors', 'all'],
    [24, 'FerrariCertifiedDealerInfoFile', 'all'], [25, 'ELEAD1ONE', 'all'],
    [26, 'FerrariCertifiedDealerInventoryFile', 'all'], [27, 'MaseratiCertifiedWebsiteMetrics', 'all'],
    [28, 'PCarMarket', 'all'], [30, 'Autobytel', 'all'], [33, 'AANportal', 'all'], [34, 'AllCollectorCars', 'all'],
    [35, 'AutoCorner', 'all'], [36, 'AutoGuide.com', 'all'], [37, 'AutoRaptor', 'all']
  ],

  /* ── the group editor, in the backend's order. A select whose options the read did not open has
       `o: null`; it shows "—" and says so when opened. w = columns of 12 at desktop. ── */
  zones: [
    { id: 'general', t: 'General', f: [
      { k: 'text', n: 'name', l: 'Group name', w: 3 },
      { k: 'flag', n: 'active', l: 'Active', w: 1 },
      { k: 'text', n: 'script', l: 'Custom script name (no .php)', w: 3 },
      { k: 'select', n: 'placed', l: 'File will be placed', req: 1, o: ['—', 'Our server', '2 copies'], w: 3 },
      { k: 'select', n: 'type', l: 'Type', o: ['All', 'New', 'Used'], w: 2 }
    ] },
    { id: 'local', t: 'Local server', f: [
      { k: 'text', n: 'l_part1', l: 'Data file name (part1)', req: 1, w: 3 },
      { k: 'select', n: 'l_ts', l: 'Timestamp', o: null, w: 3 },
      { k: 'text', n: 'l_part2', l: 'Part2', w: 3 },
      { k: 'text', n: 'l_ext', l: 'Extension', w: 3 },
      { k: 'text', n: 'l_path', l: 'Path to feed file (no "/" at the end)', req: 1, w: 6 }
    ] },
    { id: 'ftp', t: 'FTP server', f: [
      { k: 'text', n: 'ftp_host', l: 'FTP server', w: 4 },
      { k: 'text', n: 'ftp_port', l: 'Server port', w: 2, num: 1 },
      { k: 'text', n: 'ftp_user', l: 'FTP user', req: 1, w: 3 },
      { k: 'password', n: 'ftp_pass', l: 'FTP pass', req: 1, w: 3 },
      { k: 'checks', w: 12, o: [['ftp_sftp', 'SFTP'], ['ftp_pasv', 'Passive mode off'], ['ftp_usepasv', 'FTP_USEPASVADDRESS false'], ['ftp_key', 'Has SFTP key'], ['ftp_bin', 'Binary mode']] },
      { k: 'text', n: 'r_dir', l: 'Remote DIR', req: 1, w: 3 },
      { k: 'text', n: 'r_part1', l: 'Remote file (part1)', req: 1, w: 3 },
      { k: 'select', n: 'r_ts', l: 'Timestamp', o: null, w: 2 },
      { k: 'text', n: 'r_part2', l: 'Part2', w: 2 },
      { k: 'text', n: 'r_ext', l: 'Extension', w: 2 }
    ] },
    { id: 'delim', t: 'Fields delimiter', f: [
      { k: 'select', n: 'delim', l: 'Fields delimiter', req: 1, o: null, w: 3 },
      { k: 'select', n: 'headline', l: 'Headline', o: ['Headline Yes', 'Headline No'], w: 3 },
      { k: 'check', n: 'quoted', l: 'String value double quoted', w: 4 }
    ] },
    { id: 'setup', t: 'Field setup', f: [
      { k: 'flags', l: 'Constant fields', w: 3, o: [['const', 'Check for Constant Fields setup']] },
      { k: 'flags', l: 'Year-Make-Model', w: 3, o: [['ymm', 'Year-Make-Model in one field']] },
      { k: 'flags', l: 'Car URL', w: 3, o: [['carurl', 'Car URL setup']] },
      { k: 'flags', l: 'Movie', w: 3, o: [['movie', 'Movie setup'], ['youtube', 'YouTube URLs from embed to video']] }
    ] },
    { id: 'filter', t: 'Filter', f: [
      { k: 'checks', w: 12, grid: 1, o: [
        ['filter', 'Filter setup (when multi-dealer product table)', 1],
        ['img_only', 'Vehicles with images only'], ['img_3', 'Vehicles with more than 3 images only'],
        ['img_8', 'Vehicles with more than 8 images only'], ['price_only', 'Vehicles with prices only'],
        ['sold', 'Include sold vehicles'], ['no_feed_out', 'Ignore No Feed Out'], ['no_display', 'Ignore Do Not Display'],
        ['km', 'Convert kilometers to miles'], ['cad', 'Convert Canadian dollars to US']] }
    ] },
    { id: 'options', t: 'Options & text', f: [
      { k: 'select', n: 'opt_delim', l: 'Options delimiter (main_text_2 & features)', o: ['None', 'Default: space', 'PHP_EOL', '<br>', 'Comma space', 'Tab'], w: 4 },
      { k: 'seg', n: 'mt2', l: 'main_text_2 & features handling', o: ['Strip tags', 'Htmlentities', 'None'], w: 4 },
      { k: 'seg', n: 'mt13', l: 'main_text_1 & main_text_3 handling', o: ['Strip tags', 'To HTML native', 'None'], w: 4 }
    ] },
    { id: 'images', t: 'Images', f: [
      { k: 'select', n: 'img_type', l: 'Images type', o: ['No images', 'URL string', 'Actual images'], w: 2 },
      { k: 'text', n: 'img_limit', l: 'Images limit', w: 2, num: 1 },
      { k: 'select', n: 'img_name', l: 'File name', o: ['—', 'VIN_#', 'Stock_#'], w: 2 },
      { k: 'seg', n: 'img_ts', l: 'Image timestamp', o: ['No image timestamp', 'Append image timestamp', 'Send latest image timestamp'], w: 6 },
      { k: 'checks', w: 12, grid: 1, o: [
        ['img_multi', 'Multi column images setup'], ['img_nomain', 'Disable sending main images'],
        ['img_sel', 'Selected images only'], ['img_selfirst', 'Selected images first'], ['img_med', 'Send medium images'],
        ['img_default', 'Send default image when no images'], ['img_seo', 'SEO friendly image URLs']] }
    ] },
    { id: 'marks', t: 'Watermarks & overlays', f: [
      { k: 'seg', n: 'wm_lease', l: 'Lease overlay', o: ['None', 'First image', 'All images'], w: 6 },
      { k: 'seg', n: 'wm_sold', l: 'Watermark Sold', o: ['None', 'First image', 'All images'], w: 6, ck: 'wm_sold_ck' },
      { k: 'seg', n: 'wm_pend', l: 'Watermark Sale Pending', o: ['None', 'First image', 'All images'], w: 6, ck: 'wm_pend_ck' },
      { k: 'seg', n: 'wm', l: 'Watermark', o: ['None', 'First image', 'All images'], w: 6 }
    ] },
    { id: 'sql', t: 'SQL', f: [
      { k: 'sql', n: 'sql_select', l: 'MySQL extra SELECT clause', ex: 'main_text_1 AS main_text_2', w: 6 },
      { k: 'sql', n: 'sql_where', l: 'MySQL WHERE clause', ex: "AND make='Ford' AND model='Focus'", w: 6 }
    ] },
    { id: 'map', t: 'Field mapping', f: [{ k: 'map', w: 12 }] },
    { id: 'lab', t: 'Data lab', f: [{ k: 'lab', n: 'lab', l: 'Data lab', w: 4 }] },
    { id: 'notes', t: 'Notes', f: [{ k: 'area', n: 'notes', l: 'Notes', w: 12 }] }
  ]
};
