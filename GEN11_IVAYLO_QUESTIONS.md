# Questions for Ivaylo (Gen 11 review, from Nov 15)

The team's notes were applied in the mockup: features were **commented out, not deleted**.
The question about each one stays open for Ivaylo (the new backend).
This list goes onto the dashboard as its own block later.
Each entry: what we did · the note verbatim, with author and date · the open question.

---

## 1. Accounting · View All: Print button commented out
- **Done:** the Print button in the header is commented out in `pages/staff/accounting-view-all-gen11.html`.
- **Note (Bill, Nov 11):** "again I don't think we need a print button to print out this page. if someone was really needing to print the page they can use the browser print button but I think they use downloadable spreadsheets vs ever printing this page"
- **Before:** `review-shots/01-accounting-print-before.png`
- **Question:** is Print wired up on the new backend, and is it OK to drop it there too?

## 2. Manage Dealers: Print button commented out
- **Done:** the Print button in the header is commented out in `pages/staff/manage-dealers-gen11.html`. The JS is guarded so the page still works without it.
- **Note (Bill, Nov 11):** "button not needed, can you browser print button if you want to print this page o…" (the rest is in mockupdb, note mwchkdzrszx3p)
- **Before:** `review-shots/02-manage-dealers-print-before.png`
- **Question:** same as 1.

## 3. Accounting · View All: Marketing column added
- **Done:** a Marketing column was added. The flag comes from the "Marketing" package badge in the Manage Dealers export, matched by dealer id. 44 of the 205 billable dealers have it.
- **Note (Bill, Nov 11):** "missing a Marketing column so we can see who has marketing and who doesn't…" (mwcjcay4yaa2x)
- **Checked in live (Nov 16):** the flag is the dealer's Marketing Package. Live Manage Dealers counts it: "Has Marketing Package = 58 · Does Not Have = 256".
- **Question:** can Accounting read the marketing_package flag directly?

## 4. Dealer Edit: three zones commented out (Inventory & DMS, Email Routing, Web & Domains)
- **Done:** the three zones are hidden through `ZONE_HIDDEN` in `pages/staff/dealer-edit-gen11.js`. Their data stays in the fixture, and removing an id from the list brings that zone back.
- **Note (Bill, Nov 11, ×3: mwcj5pev3skmc, mwcj5iei1o4mc, mwcj5cknvn92n):** "I know we use to have another tab in the dealer setup forms but we removed that tab on purpose because it was never used and I think this was on that screen otherwise not sure where you got this from so it should be removed"
- **Before:** `review-shots/04-dealer-edit-zone-inv-before.png`, `…-email-before.png`, `…-web-before.png`
- **Question:** these zones came from the new-backend export (`s12-dealer-file-*.html`). Do these fields still exist in the new backend? Should they be removed there too, or kept hidden?

## 5. Dealer Edit: Multi Dealer = Yes reveals Select Group (built in the mockup)
- **Note (Bill, Nov 11, mwciye7vsktsn):** "in the live system if you click yes a couple more fields shows up"
- **Done:** checked in the live Dealer Account Settings (Nov 16). Yes reveals one field, "Select Group", a list of 47 dealer groups. The mockup now shows it beside the switch.
- **Questions:** does the new backend keep the dealer groups and the multi_dealer_group link? Where is the list of groups edited?
- **Security, found in the live list (Nov 16):** the dealer-group list has two junk entries, `1'` and `1',sleep(3))-- -`. These are SQL-injection test strings, and they were saved as groups. Somebody probed this form. Please check that the old form escapes its input, and remove the two entries.

## 6. Manage Dealers: "CL" feature tag hidden, "LS" relabelled "LMS", all tags shown
- **Done:** `FEAT_HIDDEN = ['CL']` and `FEAT_LABEL = { LS: 'LMS' }` in `pages/staff/manage-dealers-gen11.js`. The "+N" overflow is commented out, so every tag shows.
- **Notes (Bill, Nov 11):** "remove "CL" it is old feature that is no longer used so this is not needed in the display" (mwcifptb5spcq) · "change LS to LMS so that we know what it means" (mwchs5ryjvnk7) · "please have it show all items and not a +2 as we need to see these items as no way to know what they have without seeing it" (mwci0o9t1gc4v)
- **Before:** `review-shots/07-manage-dealers-CL-before.png`, `09-…-plus2-before.png`, `10-…-LS-before.png`
- **Question:** the export's CL title reads "carfax credentials set (legacy legend says Craigslist)". What does the backend compute CL from, and can the feature sweep stop producing it? Can the sweep emit "LMS" instead of "LS"?
- **Checked in live (Nov 16):** the live legend lists Craigslist (icon), Carfax (icon), LS = LMS, Facebook (icon), IN = Incentives, Ebay (icon) and LV = Lot Vantage. CL is a separate text code that the legend does not list. The new backend's sweep produces CL, LS, CRAIGSLIST, CARFAX and INCENTIVES only. Are Facebook, Ebay and Lot Vantage still needed? If yes, the sweep is missing them. And is Craigslist still used? The live dealer menu has no Craigslist tool; the CRAIGSLIST tag stays in the mockup (Alex, Nov 16).

## 7. Manage Dealers: "Dealer Intake Form Answers" link and the "Config Manual" popup (built in the mockup)
- **Done:** two text links at the right end of the Roster strip. Config Manual opens the live popup's 21 page-template examples, word for word (checked Nov 16). Dealer Intake Form Answers is a Google Sheet link in the live system; the mockup does not carry the sheet's address.
- **Note (Bill, Nov 11, mwci4yrmusb49):** "Need a "Dealer Intake Form Answers" link on the right side here. Also a link to "Config Manual" that opens a popup with page template examples as we use these a lot too"
- **Before:** `review-shots/08-manage-dealers-tally-before.png`
- **Questions:** in the live system the Config Manual text is hard-coded in the page (a hidden #notes block). Should the new backend keep it as static text or make it editable? Should the Intake link point to the same Google Sheet?

## 8. Single Ticket: Work Order shown again; head chips open its fields
- **Done:** the Work Order (Classification · Contact · Schedule & Billing), hidden since Oct 30, is back on the page and in the navigator. The head chips (status, priority, work type) now jump to their fields.
- **Notes (Bill, Nov 11):** "Where are the fields for assiging to the dealership (sometimes tickets get mis-assigned to the wrong dealer and that needs to be able to be changed. Also there should be fields to enter the Name, email(s), phone and subject line and they should always be present in the tickets…" (mwcgkh4v09gbr) · "these should be editable so that if assigned wrong it can be changed easily" (mwch2jlwercf9)
- **Before:** `review-shots/13-single-ticket-no-client-fields-before.png`, `12-single-ticket-head-chips-before.png`
- **Question:** does changing the Dealership on a ticket move its history and its billing to the new dealer?

## 9. Single Ticket: Dates toggle commented out, time examples open
- **Done:** every assignee card always shows Begin / Done by (the Dates button is commented out). The export's "Time entry help" is open under the time totals.
- **Notes (Bill, Nov 11):** "dates should always be open and available we do not need a toggle that wastes time when assigning out tickets for more clicks." (mwcg2nnjh0v56) · "We need the time examples like in the live system … the time display is in 5 minute increments from 5 minutes to 1 hour" (mwcg51f5qbzag)
- **Before:** `review-shots/17-single-ticket-dates-toggle-before.png`, `16-single-ticket-time-help-before.png`
- **Question:** the export lists 10 min = 0.16 and 40 min = 0.66 (truncated), while 20 min = 0.33 and 50 min = 0.83 are rounded. Should the help show 0.17 / 0.67, and does the backend store what is typed?

## 10. Single Ticket: ToDo attachments and Remove ToDo (built in the mockup)
- **Note (Bill, Nov 11, mwcgflwva7a2i):** "need ability to add a file attachement to a todo as well"
- **What we know:** the live system has this option (Alex, Nov 15), so the mockup now has it: the ToDo composer carries the same file drop as Messages. In the new-backend export the only upload is the Messages composer.
- **Also (Alex, Nov 15, a new feature added to the concept on his responsibility):** a ToDo can be removed from its Edit ("Remove ToDo", which deletes its files too). The export has removeMessage and removeNote, but no removeTodo.
- **Questions:** does the new backend store files on a ToDo yet, and with which endpoint? Is there a removeTodo, or can it be added the same way as removeNote?

## 11. My Work Queue: the assignee's own dates on the list (built in the mockup)
- **Note (Bill, Nov 11, mwcfweit0hqkn):** "There should be 2 sets of dates here...one is for the person assigned to the tickets dates and the other is the ticket dates itself … so both dates are needed on the work lists."
- **Done:** the live My Work list has My Begin Date · My Completion Date · Begin Date · Completion Date (checked Nov 16). The mockup now has the same four columns. The new-backend export's work queue has only Begin Date and Completion Date.
- **Before:** `review-shots/18-mwq-dates-header-before.png`
- **Question:** can the work-queue query return the viewer's own Begin / Completion per ticket (set on the ticket's Assigned To)?

## 12. My Work Queue: rank as a drop-down, all assignees, Reporting filter
- **Done:** the Priority rank is a `<select>` 0–299 (the click-to-edit number field is gone). Every assignee is listed. Reporting is in Filters, with the production options. The Filters panel stays open and is remembered.
- **Notes (Bill, Nov 11):** mwcfethdmlinn (rank drop-down) · mwcftqunseq03 (taller bar) · mwcfqpafwz9o1 ("missing the "reporting" search drop down … stay open until we close it based on user")
- **Before:** `review-shots/21-mwq-rank-before.png`, `19-mwq-assigned-plus2-before.png`, `20-mwq-filters-before.png`
- **Question:** how do Tagged As Completed and Marketing Clients filter on the server? Should "stays open" be saved per user on the server rather than in the browser?

## 13. Single Lead: one "Internet Management Checkoff" checkbox
- **Done:** the "Internet" checkbox is commented out; the remaining one is labelled "Internet Management Checkoff".
- **Note (Bill, Nov 10, mwb3452xjbl4r):** "this should be one checkbox labeled "Internet Management Checkoff" not 2 checkboxes"
- **Before:** `review-shots/26-single-lead-two-checkboxes-before.png`
- **Question:** the new backend sends two flags (`internet`, `imc`). Which one does the single checkbox write?

## 14. Single Lead: ReSend / Email, Credit App, Paperwork
- **Notes (Bill, Nov 10):** mwb9bc6z72t11 (ReSend / Email, "a new feature Dima just added") · mwb9lccr0nb5j (Credit App tab, hidden for users blocked from credit apps) · mwb9ziplpqeam (Paperwork forms filled with the customer's and dealer's info)
- **Before:** `review-shots/24-single-lead-head-buttons-before.png`, `23-…`, `22-…`, `25-…`
- **Question:** are ReSend / Email, the Credit App view (with its per-user block) and Paperwork in the new backend yet? What are the endpoints?
- **Built Nov 16 (#25):** a Write email composer in the Emails section, matching the live Email tab (To, BCC, Subject, File to attach, message, Send). Questions: which endpoint sends a lead email and stores it in the lead's Outbox? Does the new backend keep the rich-text editor (the live one is CKEditor 5)?
- **Built Nov 16 (#22):** a Dealer Paperwork section, as in the live lead card. In live each form is a per-dealer template that sale_paperwork.php fills from the lead; Chicago Motor Cars and Miller have only Credit Application. Questions: where does the new backend keep each dealer's paperwork templates, and does it fill them from the lead the same way?

## 15. All Leads: select all, bulk status; Email mode, Comments column, Stock # list
- **Done:** a select-all checkbox and "Set status…" in the selection tray. Both are in the export.
- **Notes (Bill, Nov 10):** mwb31f38hqunv (check-all; "Email" and "Bulk Update" radios) · mwb2ymcdrv8zc (Comments column with the last comment date) · mwb2s0xqpezsw ("Available Stock # [drop down] … Include Sold [checkbox]")
- **Before:** `review-shots/27-28-all-leads-header-before.png`, `29-all-leads-more-before.png`
- **Question:** the new backend has bulk Assign and Set status, but no bulk Email, no Comments column and a free-text Stock #. The Comments column and the Stock # list are now in the mockup (Nov 16). Bulk Email: in the live Lead Manager, "Send Email" sends the selected leads to the Newsletter tools, so it depends on the Newsletter Tools decision (#57). Is it planned?
- **Built Nov 16 (#29):** More → Vehicle of interest has the live "Available Stocks" list and "Include Sold". Question: which endpoint gives the dealer's available stock (and the sold cars when Include Sold is ticked) for that list?
- **Built Nov 16 (#28):** a Comments column with the date the last comment was added (live Lead Manager has it). Question: can the leads list return the last-comment date per lead? The demo only knows it when the last activity is "Comments Added".

## 16. Single Vehicle: fields commented out
- **Done:**
  - More Details: Book Value, Discount, Original Price, Model Number, Body Code, Add Options and Zero Down are commented out (only Location remains).
  - CARFAX: Report date and Last checked are out.
  - Video: Other video link is out.
  - Window Sticker: Open PDF is out.
  - Status: Pending is out.
- **Notes (Bill, Nov 6):** mw5k7kf3fzqyv (Book Value "needs to be deleted from all dealers databases") · mw5k878jxp2l5 (Discount, same) · mw5k9cvi6bbgr (Original Price "is not a real thing") · mw5kah6rw7i9a (Model Number) · mw5katnz159yx (Body Code) · mw5kbsnt5vjra (Add Options) · mw5kcq1t2u97y (Zero Down) · mw5kgqutrltji / mw5kh8di6rxwo (CARFAX dates) · mw5koofnfj54n (Other video link) · mw5kt10f9yar9 (Open PDF) · mw5jxxv6msusc (no Pending)
- **Before:** `review-shots/44-50-single-vehicle-more-details-before.png`, `41-42-…`, `38-…`, `36-…`, `53-…`
- **Question:** are these columns dropped from the new backend's vehicle table too (Bill asks for Book Value and Discount to be deleted from all dealers' databases)? Note the conflict: Karen asked for a Discount column on All Vehicles.

## 17. Single Vehicle: Specs & VIN first, editors swapped, Buyers Guides section, YouTube as a list
- **Done:**
  - Specs & VIN is the first section.
  - The HTML editor moved from Bulleted Text to Description 2.
  - A Buyers Guides section was added (9 print links plus the guide text).
  - YouTube URLs is a textarea, one per line.
- **Notes (Bill, Nov 6):** mw5k1ld3u3w0b · mw5l3tpdfrmt7 · mw5l2q3vw4ifu · mw5kynn25yg9t · mw5koofnfj54n
- **Before:** `review-shots/52-…`, `32-33-…`, `34-…`, `38-…`
- **Question:** does the backend store several YouTube links in the one field (newline-separated)? Is Description 2 (`caption`) HTML-safe on the VDP?

## 18. Single Vehicle: open items
- VIN Decoder Selectable (mw9t6yc4e4hkg, screenshot item25): built in the mockup on Nov 16 as in the live editor (three pick lists, empty state "No selectable for this vehicle"). Where do the decoded styles / engines / transmissions come from in the new backend, and does picking one re-run the decode?
- Edit lock (mw5kfohw9p2s7): built in the mockup on Nov 16 after the live list's unlockVehicle() (View only / Unlock and take control; who and since when at the top of the editor). Does the new backend expose who holds the lock and since when, and an unlock that hands over the next save?
- CARFAX PDF upload (mw5kifnhdwdif): commented out in the mockup (only Mild Collection uses it; CARFAX sends links, not PDFs). Can it be a per-dealer option that only Mild Collection gets?
- Factory sticker and Do Not Report VIN To Carfax are per-dealer custom options in the live system today (`no_carfax` is a custom field). Bill wants both for every dealer after go-live. Can the new backend make them standard fields?

## 19. All Vehicles and the dealer menu
- **Done:** Feed Out Manager added to the Inventory menu on all four dealer pages. Form Editor added under Site ("AAN admins only"). New submissions, Customers and Referrals are commented out and moved to the New features list, because the live dealer menu does not have them (checked Nov 16). The Photos / Window sticker / Upload photos actions open the editor at those sections.
- **Notes (Bill, Nov 6):** mw5j2hb43x1oq (Feed Out Manager; "what is New Submissions") · mw5jhlfxpnoy9 (row icons) · mw5jlp578sfst (upload from the list)
- **Before:** `review-shots/60-dealer-nav-inventory-menu-before.png`, `59-dealer-nav-leads-menu-before.png`, `58-dealer-nav-site-menu-before.png`
- **Questions:**
  - Newsletter Tools (mw5j97noenshu): back in the dealer menu (Alex, Nov 16), only that item, for the email lists and the subscribe forms. Does the new backend keep the list download and the subscribe-form collection? The sending part was the Oct 29 worry.
  - Form Editor for admins only (mw5j6akexx0bp): the link carries `data-admin-only`. How does the backend tell an admin from a dealer on the dealer pages?
  - Leads menu (mw5j4jcb9jnl6): the live menu has only the Lead Manager. Customers, Referrals and New submissions are new-backend pages; they are commented out and on the New features list. Are they ready, or do they wait for after go-live?
  - The live dealer menu also has Auction Tools, which is not in the new-backend export or the mockup. Is it still used?
  - Options filter (mw5io1x6i1qnq): the filter is commented out (it was a mockup demo; neither the live system nor the export has one). Bill wants the keyword search to cover the vehicle's options instead. Can the search query include the options text?
  - Bulk edit (mw5i6v4ypnczi): built in the mockup on Nov 16 behind "Inline edit" (Price, Discount Price, Invoice Price, Do Not Display On Site, Sale Pending; one Update), as the live Inventory Manager's in-row editing. Is there an endpoint that saves many vehicles in one call?
  - Value totals (mw5i9qmktowkl): is there an endpoint for inventory-wide Discount / Invoice totals?
  - Column order per user (mw5iujnxurg28): the mockup has Columns (show, hide, order, reset) and, since Nov 16, the live heading swap menu. It saves in the browser. Can the new backend save the layout per user, as the live system does?

## Checked in the new backend (newbackendcert.aandemo.com, Nov 16)
Alex and Claude read the new backend: the menus, the Add New Dealer form and the API Console (255 endpoints). Nothing was saved. Several questions above are answered:
- **5. Dealer groups:** answered. The new backend has a Dealer Groups page (`/manage/dealer-groups`, endpoints `dealer-groups.index/store/update`). Its dealer form shows **Dealer Group** (`f.multi_dealer_group`, "— choose —" + 49 groups, A–Z) when Multi Dealer = Yes, as the live system does. The two SQL-injection test strings (`1'`, `1',sleep(3))-- -`) were migrated into it too: clean them up there.
- **4. Dealer Edit zones:** the new backend still has Web & Domains, Email Routing and Inventory & DMS. The only question left is whether to remove them or keep them hidden.
- **6. Craigslist:** still a live feature in the new backend (`craigslist.postings / posts.store / inquiries / stats`). The CRAIGSLIST tag stays.
- **14. Single Lead:** email from a lead `leads.emails.store`; Credit App view and print `leads.finance-app.show/print`; Paperwork with per-dealer templates, print and email `legacy.paperwork.*`. All there. No ReSend endpoint was found: is ReSend `leads.emails.store`, or still to come?
- **15. All Leads:** bulk actions `leads.bulk`; the Available stock list can use `leads.vehicle.search`. Open: does `leads.index` return each lead's last comment date (`leads.notes.store` writes the notes)?
- **18 / Edit lock:** `vehicles.locks.index` (the list) and `vehicles.lock.store/destroy`; VIN Decoder `vehicles.vin-decode`; per-dealer CARFAX settings `dealers.carfax.preferences` (a place for Mild Collection's PDF upload option).
- **19. Bulk edit:** `vehicles.bulk-update` exists.
- **19. Customers / Referrals:** they exist as legacy tools (`/legacy-tools/customers`, `/legacy-tools/referrals`). They stay out of the dealer menu until after go-live (facelift rule).
- **19. Newsletter Tools:** no newsletter endpoints at all. But `leads.update` subscribes the person to newsletter topics (`nl_utot`), so subscriber data is kept. Needed for go-live: the list download and the subscribe-form collection (Bill), or Newsletter Tools stays a link to the legacy page.
- **10. ToDo:** no ToDo endpoints, no ticket attachments, and no delete for any ticket entry (`tickets.*` has store, queue, show, update, changelog, messages.store, rank.store, values.update). The mockup now matches the old system: no Remove ToDo (after go-live). Do ToDo attachments (which the live system has) go through `tickets.messages.store`?
- **19. Column layout per user:** settings exist per dealer only (`dealers.settings`), none per user. The live system remembers the layout per user, so the new backend needs a user setting.
- **19. Auction Tools:** no endpoints. Is it still used?
- **Still for Ivaylo (fields not shown in the console):** 13 which flag the Internet checkbox writes (`leads.update`); 17 whether the YouTube field keeps several links; 11 whether `tickets.queue` returns the viewer's own Begin / Completion dates; 19 / #64 whether `vehicles.index` returns inventory-wide Discount and Invoice totals.

## Checked again in the new backend and the live system (Nov 17)
Read only: the API Console (17 endpoints), Manage Dealers, My Work, a ticket page; the live Manage Dealers list. Nothing was saved.
- **18. Edit lock — answered.** `vehicles.locks.index` returns each live lock as "name since time"; `vehicles.lock.store` with `takeover=1` takes the lock over (the live "Unlock and take control"); a lock expires after 4 hours. Off the question list.
- **18. VIN Decoder Selectable — answered.** The style / engine / transmission lists come from the VIN decode (DataOne), cached per dealer; `apply=true` writes the picked values into the vehicle; a cached decode never calls out again. Off the list.
- **15 / #28. Comments date format — answered** by Bill's own screenshot (item27): MM/DD/YYYY. The screenshot request is off the list. Still open: the new leads list returns no last-comment date.
- **1–2. Print:** the new Manage Dealers has no Print (it offers Dealers CSV). Accounting was not seen (billing pages need billing access).
- **6. CL:** in the live list CL is a text code its legend does not explain (Craigslist has its own icon there); the new backend computes CL from the dealer's Carfax account, so CL = Carfax Login, not Craigslist. Bill asked to remove it, so it stays hidden. The new backend still shows LS, not LMS.
- **8. Dealership on a ticket:** the new ticket page lets staff change it (Work Order · classification); its HTTP update keeps the stored dealer. Open: do history and billing move with it?
- **10. ToDo files:** a ToDo is a ticket message (`todo_note`), and ticket messages take no files at all. Attachments are missing for go-live.
- **11. My dates:** the queue API says My Work rows carry the assignment columns; the new My Work screen shows only Begin / Completion.
- **12. Filters:** Marketing Clients exists (`marketing`, marketing-package dealers). Reporting and Tagged As Completed are missing in the new My Work.
- **18. CARFAX PDF:** the dealer Carfax settings have no PDF option, so the per-dealer upload is a new feature (moved to New features).
- **Round 1 · Feed Management:** the new backend keeps all 18 feeds in its menu, as links to the old pages. **Commercials:** the new backend shows those fields only to billing-authorized staff.
