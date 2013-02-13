## 2013-01-25

Instruments now can be rendered not only as <canvas> element but as well as any tag. The text area instrument was converted to be rendered as <div>.
Whatever the instruments needs, teamwall will render it. The instrument has to take care that it will do the right stuff.

## 2013-01-21

To remind that the build is red, the buildAlert command can now play sounds at an interval when the build chain is broken.

## 2013-01-04

Some more work on managing the instruments on the screen. The new config gui can be shown and has the elements: Drag'n'Drop to delete, reload and showing the new config in an overlay.

## 2013-01-01

Clicking on the Settings icons in the lower right corner now enables drag mode.

## 2012-31-12

All instruments can now be moved with the mouse. On each change the complete config file will be written to the javascript console.

Added a title option to `buildchain` instrument.

## 2012-12-29

Instruments can now be positioned. **The format of the config file changed**. It now has two sections: one for the instruments and one for the layouting options. Dimensions and position is now completly seperated from the configuration of the instrument itself. Both are coupled via the `id` attribute.

Added a `textarea` instrument which displays text.

Added a `template` instrument which can be used as base for new instruments.

Added a trend to the `percentage` instrument.

## 2012-12-26

The **percentage instrument** has now a parameter `higher_is_better`. Set to true it will render things 'greener' when values are closer to 100, otherwise it will look better if closer to 0.



