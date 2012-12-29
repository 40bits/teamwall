## 2012-12-29

Instruments can now be positioned. **The format of the config file changed**. It now has two sections: one for the instruments and one for the layouting options. Dimensions and position is now completly seperated from the configuration of the instrument itself. Both are coupled via the `id` element.

Added a `textarea` instrument which displays text.

Added a `template` instrument which can be used as base for new instruments.

Added a trend to the `percentage` instrument.

## 2012-12-26

The **percentage instrument** has now a parameter `higher_is_better`. Set to true it will render things 'greener' when values are closer to 100, otherwise it will lokk better if closer to 0.



