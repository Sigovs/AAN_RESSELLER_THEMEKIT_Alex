/* AAN · Staff UI · Sales Report — GENERATION 11 · fixture

   Read out of the new backend (newbackendcert /reports/sales, live DOM, 1918px wide) on 18 Nov 2026,
   not authored. Only the year 2026 was read; the other years are left empty on purpose and the page
   says so. All Dealers has 232 rows in the backend; the first 40 (by total, as the backend sorts them)
   were read and are the only rows here. The totals rows are the backend's own, over all 232 dealers.

   A month the backend leaves blank is null here (no sales that month, or December not yet reached). */
window.SR = {
  read: '18 Nov 2026',
  year: 2026,
  years: ['All', 2023, 2024, 2025, 2026],

  tiles: [
    { k: 'Fleet sold · 2026', v: '90,340', s: '232 dealers reporting' },
    { k: 'Top seller', v: 'Design Auto LLC', s: '3,603 sold · 4.0% of fleet' },
    { k: 'FCKerbeck', name: true, v: '369', s: '5 brand lines' },
    { k: 'Miller Motorcars', name: true, v: '795', s: '13 showrooms' }
  ],

  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  sections: [
    {
      id: 's-fck', jump: 'FCKerbeck', total: 369,
      title: 'FCKerbeck', by: 'grouped by brand',
      first: 'Brand / Bucket',
      /* the backend's bucket names are upper case in its data (USED, BENTLEY…); shown here as names */
      rows: [
        ['Used',         212, [17, 13, 22, 18, 14, 29, 15, 23, 30, 18, 13, null]],
        ['Bentley',       78, [9, 3, 10, 10, 7, 2, 7, 3, 10, 7, 10, null]],
        ['Lamborghini',   29, [4, 1, 3, 2, 3, null, null, 7, 1, 4, 4, null]],
        ['Rolls-Royce',   27, [1, 1, 2, 3, 6, 2, 3, 1, null, 5, 3, null]],
        ['Aston Martin',  23, [1, null, 2, 5, 3, null, 3, 4, 1, 4, null, null]]
      ],
      foot: { label: 'Section total', total: 369, m: [32, 18, 39, 38, 33, 33, 28, 38, 42, 38, 30, null] }
    },
    {
      id: 's-miller', jump: 'Miller Motorcars', total: 795,
      title: 'Miller Motorcars', by: 'grouped by showroom location',
      first: 'Showroom',
      rows: [
        ['Ferrari of Greenwich',             132, [10, 9, 10, 17, 17, 10, 14, 13, 8, 17, 7, null]],
        ['Aston Martin of Greenwich',        114, [13, 10, 7, 11, 8, 7, 13, 20, 8, 13, 4, null]],
        ['Bentley Greenwich',                103, [14, 7, 14, 7, 14, 8, 13, 11, 5, 9, 1, null]],
        ['Maserati of Westport',              78, [8, 7, 8, 7, 8, 6, 12, 8, 4, 7, 3, null]],
        ['McLaren Greenwich',                 73, [7, 2, 6, 8, 10, 5, 12, 11, 5, 4, 3, null]],
        ['Miller Motorcars',                  69, [8, 3, 11, 6, 6, 8, 6, 2, 9, 6, 4, null]],
        ['Alfa Romeo of Westport',            58, [6, 6, 7, 7, 6, 7, 5, 1, 5, 5, 3, null]],
        ['Maserati of Greenwich',             55, [3, 4, 8, 6, 6, 4, 4, 4, 4, 10, 2, null]],
        ['Rolls-Royce Motor Cars Greenwich',  49, [4, 3, 4, 5, 9, 5, 7, 5, 2, 1, 4, null]],
        ['Alfa Romeo of Greenwich',           40, [3, 7, 3, 4, 1, 4, 5, 6, 1, 4, 2, null]],
        ['Miller Motorcars Classics',         16, [null, 3, 1, null, 5, null, null, 1, 3, 1, 2, null]],
        ['Bugatti of Greenwich',               4, [null, 1, 1, 1, 1, null, null, null, null, null, null, null]],
        ['Pagani of Greenwich',                4, [null, 1, null, null, null, null, null, 1, 2, null, null, null]]
      ],
      foot: { label: 'Section total', total: 795, m: [76, 63, 80, 79, 91, 64, 91, 83, 56, 77, 35, null] }
    },
    {
      id: 's-all', jump: 'All Dealers', total: 90340,
      /* the backend's subtitle was cut in the read ("every reachable …"); only the title is shown */
      title: 'All Dealers', by: '',
      first: 'Company Name', ranked: true, count: 232,
      rows: [
        [1,  'Design Auto LLC',                        3603, '4.0%', [314, 343, 364, 368, 378, 304, 325, 308, 288, 409, 202, null]],
        [2,  'Rolls-Royce Motor Cars Long Island',     2252, '2.5%', [4, 3, 5, 6, 3, 2087, 31, 7, 25, 18, 63, null]],
        [3,  'Lamborghini Long Island',                2252, '2.5%', [4, 3, 5, 6, 3, 2087, 31, 7, 25, 18, 63, null]],
        [4,  'FC Kerbeck',                             1611, '1.8%', [133, 124, 192, 170, 146, 150, 139, 150, 158, 156, 93, null]],
        [5,  'Bentley Palmyra N.J.',                   1611, '1.8%', [133, 124, 192, 170, 146, 150, 139, 150, 158, 156, 93, null]],
        [6,  'F.C. Kerbeck Lamborghini Palmyra N.J.',  1611, '1.8%', [133, 124, 192, 170, 146, 150, 139, 150, 158, 156, 93, null]],
        [7,  'Rolls-Royce Motor Cars Philadelphia',    1611, '1.8%', [133, 124, 192, 170, 146, 150, 139, 150, 158, 156, 93, null]],
        [8,  'F.C. Kerbeck Aston Martin',              1611, '1.8%', [133, 124, 192, 170, 146, 150, 139, 150, 158, 156, 93, null]],
        [9,  'Lotus Las Vegas',                        1453, '1.6%', [151, 123, 134, 141, 127, 153, 153, 158, 135, 122, 56, null]],
        [10, 'iLusso',                                 1342, '1.5%', [150, 132, 136, 134, 126, 141, 115, 108, 121, 110, 69, null]],
        [11, 'iLusso Palm Beach',                      1342, '1.5%', [150, 132, 136, 134, 126, 141, 115, 108, 121, 110, 69, null]],
        [12, 'iLusso Houston',                         1342, '1.5%', [150, 132, 136, 134, 126, 141, 115, 108, 121, 110, 69, null]],
        [13, 'Ilusso Scottsdale',                      1342, '1.5%', [150, 132, 136, 134, 126, 141, 115, 108, 121, 110, 69, null]],
        [14, 'Autobyzack Inc',                         1336, '1.5%', [113, 124, 128, 114, 110, 95, 125, 134, 140, 143, 110, null]],
        [15, 'Auto Collection Murfreesboro',           1283, '1.4%', [129, 157, 147, 127, 115, 122, 110, 108, 119, 99, 50, null]],
        [16, 'Autopro Nashville',                      1283, '1.4%', [129, 157, 147, 127, 115, 122, 110, 108, 119, 99, 50, null]],
        [17, 'Marshall Goldman Motor Sales',           1252, '1.4%', [77, 89, 120, 120, 116, 142, 106, 107, 102, 203, 70, null]],
        [18, 'Marshall Goldman Beverly Hills',         1252, '1.4%', [77, 89, 120, 120, 116, 142, 106, 107, 102, 203, 70, null]],
        [19, 'Marshall Goldman Cleveland',             1252, '1.4%', [77, 89, 120, 120, 116, 142, 106, 107, 102, 203, 70, null]],
        [20, 'Marshall Goldman Newport Beach',         1252, '1.4%', [77, 89, 120, 120, 116, 142, 106, 107, 102, 203, 70, null]],
        [21, 'Chicago Motor Cars',                     1070, '1.2%', [95, 99, 118, 87, 96, 88, 105, 119, 107, 104, 52, null]],
        [22, 'Find a Luxury Car',                      1070, '1.2%', [95, 99, 118, 87, 96, 88, 105, 119, 107, 104, 52, null]],
        [23, 'Midwest Truck Group',                    1070, '1.2%', [95, 99, 118, 87, 96, 88, 105, 119, 107, 104, 52, null]],
        [24, 'Karma Naperville',                       1070, '1.2%', [95, 99, 118, 87, 96, 88, 105, 119, 107, 104, 52, null]],
        [25, 'Beverly Hills Car Club',                 1069, '1.2%', [39, 26, 9, 2, null, 557, 89, 97, 106, 92, 52, null]],
        [26, 'Platinum Cars',                          1040, '1.2%', [90, 76, 115, 110, 89, 98, 80, 111, 106, 108, 57, null]],
        [27, 'Platinum Cars Marietta',                 1040, '1.2%', [90, 76, 115, 110, 89, 98, 80, 111, 106, 108, 57, null]],
        [28, 'Platinum Cars Alpharetta',               1040, '1.2%', [90, 76, 115, 110, 89, 98, 80, 111, 106, 108, 57, null]],
        [29, 'Karma of Fuquay',                         984, '1.1%', [61, 77, 123, 94, 107, 73, 97, 118, 96, 97, 41, null]],
        [30, 'Mundo Autos INC.',                        924, '1.0%', [79, 85, 100, 83, 92, 140, 91, 73, 73, 79, 29, null]],
        [31, 'A X A Boston',                            881, '1.0%', [91, 52, 96, 101, 78, 84, 71, 85, 86, 95, 42, null]],
        [32, 'Miller Motorcars',                        798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [33, 'Bentley Greenwich',                       798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [34, 'Rolls-Royce Motor Cars Greenwich',        798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [35, 'McLaren Greenwich',                       798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [36, 'Maserati of Greenwich',                   798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [37, 'Ferrari of Greenwich',                    798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [38, 'Maserati of Westport',                    798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [39, 'Alfa Romeo of Greenwich',                 798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]],
        [40, 'Pagani of Greenwich',                     798, '0.9%', [76, 63, 80, 79, 92, 65, 92, 83, 56, 77, 35, null]]
      ],
      foot: { label: 'Fleet total · 232 dealers', total: 90340, m: [7820, 7024, 8445, 8807, 8437, 12504, 8173, 8283, 7498, 8270, 5079, null] }
    }
  ]
};
