# Month Picker

A directus interface extension that allows easy picking of any month in a given
year.

![screenshot](https://raw.githubusercontent.com/joggienl/directus-extension-month-picker/v1.0.6/docs/screenshot.png)

## Description

Select a month in any given year. The selected month will be saved as `date`
field in the database, using the `yyyy-MM-dd` format. So March 2004 will save
`2004-04-01` to the database.

You can also use the "Set To Now" button to pick the current month.

Use the buttons above and below the year to go back (or forward) in time.

The Picker should be mobile friendly and should also be translated well.

The display of the interface has been set to always display as `MMMM yyyy`
("March 2004"). Let me know if configuration is needed here. The display of the
overview can be adjusted as you please. I would recommend `MMMM yyyy` as well
there but that is up to you.

## Adding to data model

You can directly add the "Month Picker" from the "Selection" group when creating
new fields. Any Datetime field of type `date` can be updated to use the "Month
Picker" as interface option.

## Some additional notes

This extension has been inspired upon the official datetime picker that directus
ships with. There is actually a `monthSelect` plugin available for flatpick, the
datetimepicker Directus uses under the hood. Support for that has not been added
though.
