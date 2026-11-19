/* AAN · Staff UI · Activity Report — GENERATION 11 · fixture

   Read from the new backend (newbackendcert, /work/activity) on 2026-11-18, read only, range This Week
   (Nov 16 – Nov 19, 2026). The backend found 642 records (641 shown); its log lists 501 rows, of which
   this sample carries the first 13 in the backend's own order (Date/Time, newest first). The six summary
   figures and the twelve staff rows are the backend's, complete. Nothing is invented.

   Privacy (the page is public): client people's names inside notes are removed; dealerships (businesses)
   and AAN staff names stay.

   Lists the backend has but this sample does not carry in full are marked by their real size:
   Action (17 actions, 12 read here), User (49 options: All, Not assigned and the roster; the 12 active
   staff here), Dealer (764 dealers; the 11 read here). */
window.AR = {
  read: 'Nov 18, 2026',
  /* the range the figures below belong to */
  week: { label: 'This Week', start: '2026-11-16', end: '2026-11-19', line: 'Nov 16 – Nov 19, 2026', short: 'Nov 16–19' },
  found: 642, shown: 641, logRows: 501,

  /* the backend's range buttons; only This Week was read */
  ranges: ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom…'],

  /* summary tiles: label / value / sub — verbatim */
  tiles: [
    ['Records', '642', '641 shown'],
    ['Staff active', '12', 'of 48 on the roster'],
    ['Tickets touched', '104', '37 newly created'],
    ['Dealers touched', '66', 'of 764 with tickets'],
    ['Notes posted', '282', '142 client · 113 int · 27 todo'],
    ['Hours logged Δ', '+41.4 h', 'from 82 time entries', 'i']
  ],

  /* staff table: employee, rows, share %, tickets, notes, hours Δ ('' = none) */
  staff: [
    ['Kirsten McFarland', 205, 32.0, 54, 91, '+0.44'],
    ['Bill Simons', 171, 26.7, 37, 65, '+6.49'],
    ['Karen Conrad', 132, 20.6, 30, 67, '+10.35'],
    ['Sergey Bukreev', 34, 5.3, 14, 17, '+13.77'],
    ['Scott McFarland', 25, 3.9, 8, 7, '+1.00'],
    ['Ivaylo Guenkov', 24, 3.7, 4, 10, '+3.25'],
    ['Dmitriy Lebedev', 18, 2.8, 5, 6, '+2.74'],
    ['Chris Jungheim', 13, 2.0, 2, 4, '+0.33'],
    ['Alex Sigoff', 10, 1.6, 7, 10, ''],
    ['Samantha McFarland', 5, 0.8, 1, 2, '+3.00'],
    ['Matthew Jungheim', 3, 0.5, 2, 3, ''],
    ['Max Hansen', 1, 0.2, 1, 0, '']
  ],

  /* the Action select: 17 actions after "All"; these 12 were read */
  actions: ['Ticket created', 'Ticket set completed', 'Employee assigned', 'Employee Estimated Time', 'Employee Time Spent',
    'Waiting on client Set', 'Waiting on client Unset', 'Billable Set', 'Message posted', 'Internal note posted',
    'Employee checked completed', 'Estimated Time Unspecified'],
  actionsTotal: 17,
  usersTotal: 49,           /* All, Not assigned, the roster */
  dealersTotal: 764,
  /* the Dealer list's first five, and the dealerships in the sampled log */
  dealers: ['1 Stop Leasing', '29 Auto Outlet', '3 Pedal Stable', '30A Car Barn', '312 Collection',
    'AAN', 'Cars Dawydiak', 'Chicago Motor Cars', 'Godspeed Motors', 'Perfect Auto Collection',
    'The Luxury Collection - McLaren San Francisco'],

  /* log rows, the backend's first 13 (newest first):
     [date, time, employee, ticket, dealership, subject, action text, glyph, action (Action select value or ''),
      hours [value, whose, delta] or null, message / notes] */
  log: [
    ['11/17/2026', '08:01 pm', 'Ivaylo Guenkov', '49564', 'Perfect Auto Collection', 'Google Business Profile - Duplicate Listing',
      'To Do Created For Matthew Jungheim', 'todo', '', null,
      'call scott and offer ASAP to submit a GMB support request in…'],
    ['11/17/2026', '08:01 pm', 'Ivaylo Guenkov', '49564', 'Perfect Auto Collection', 'Google Business Profile - Duplicate Listing',
      'Assignment for Ivaylo Guenkov checked completed', 'check', 'Employee checked completed', ['1.00', 'Ivaylo Guenkov', ''],
      'Reported time spent: 1.00'],
    ['11/17/2026', '08:00 pm', 'Ivaylo Guenkov', '49564', 'Perfect Auto Collection', 'Google Business Profile - Duplicate Listing',
      'Employee Matthew Jungheim assigned', '', 'Employee assigned', ['0.00', 'Ivaylo Guenkov', ''],
      ''],
    ['11/17/2026', '07:59 pm', 'Ivaylo Guenkov', '49601', 'The Luxury Collection - McLaren San Francisco', 'quote Buy Cars',
      'Employee Ivaylo Guenkov Estimated Time', 'clock', 'Employee Estimated Time', ['1.25', 'Ivaylo Guenkov', ''],
      'Previous Value: 0.00; Current Value: 1.25'],
    ['11/17/2026', '07:59 pm', 'Ivaylo Guenkov', '49601', 'The Luxury Collection - McLaren San Francisco', 'quote Buy Cars',
      'Employee Ivaylo Guenkov Time Spent', 'clock', 'Employee Time Spent', ['1.25', 'Ivaylo Guenkov', '+1.25'],
      'Previous Value: 0.00; Current Value: 1.25'],
    ['11/17/2026', '07:59 pm', 'Ivaylo Guenkov', '49601', 'The Luxury Collection - McLaren San Francisco', 'quote Buy Cars',
      'Int. Note Posted', 'edit', 'Internal note posted', null,
      'met with the client for almost an hour to go over the quote…'],
    ['11/17/2026', '05:11 pm', 'Scott McFarland', '49564', 'Perfect Auto Collection', 'Google Business Profile - Duplicate Listing',
      'Int. Note Posted', 'edit', 'Internal note posted', null,
      'Reached out and requested a call back…'],
    ['11/17/2026', '05:00 pm', 'Karen Conrad', '49560', 'AAN', 'misc time not tracked in tickets',
      'Employee Karen Conrad Time Spent', 'clock', 'Employee Time Spent', ['8.93', 'Karen Conrad', '+0.83'],
      'Previous Value: 8.10; Current Value: 8.93'],
    ['11/17/2026', '05:00 pm', 'Karen Conrad', '49560', 'AAN', 'misc time not tracked in tickets',
      'Int. Note Posted', 'edit', 'Internal note posted', null,
      '[50 minutes] Checked and responded to emails…'],
    ['11/17/2026', '04:56 pm', 'Karen Conrad', '49600', 'Chicago Motor Cars', 'Chicago Motor Cars Sebastian',
      'Ticket created', 'plus', 'Ticket created', ['0', '', ''],
      ''],
    ['11/17/2026', '04:56 pm', 'Karen Conrad', '49600', 'Chicago Motor Cars', 'Chicago Motor Cars Sebastian',
      'Message Posted', 'mail', 'Message posted', null,
      '\u{1F4CE} IMG_0425.PNG \u{1F4CE} IMG_0424.PNG Please help…'],
    ['11/17/2026', '04:51 pm', 'Karen Conrad', '49582', 'Godspeed Motors', 'Users',
      'Message Posted', 'mail', 'Message posted', null,
      'Awesome thank you very much'],
    ['11/17/2026', '04:50 pm', 'Karen Conrad', '49543', 'Cars Dawydiak', 'Add schema',
      'Int. Note Posted', 'edit', 'Internal note posted', null,
      'Thank you so much! Looks good.']
  ]
};
