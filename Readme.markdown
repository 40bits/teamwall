# Teamwall

__The developer's dashboard.__

This is the early stages Teamwall project.

Teamwall is a small dashboard the a team that develops software.

**Basic idea**

Show the developer the information he needs to know how the code is doing.

**What can that be**

Code Coverage, Live stats from servers, Incoming bugs etc.

It looks like this:

![Demo Screen](https://raw.github.com/40bits/teamwall/master/documentation/images/demo_screen.png "Demo Screen")

**Changes**

Checkout the [Changes file](teamwall/blob/master/Changes.markdown).


# Get started #

Put everything in a directory served by a web server. You can also run
`node server.js` which will start a server on port 8888. Find below a list of instruments which can be used to visualize ctitical
information.

What `you` need to do is to create a `teamwall.json` file and put it into the root directory of teamwall. This file contains
the description of the instruments to be shown (and how they are updated). Every 15 seconds the values are updated.
It is totally up to you where and when to get the data from, Teamwall simply reads the urls and displays it's json data.

If you want to serve multiple dashboard from one host you can add the parameter `dashboard` to the url, e.g.

	http://localhost:8888/?dashboard=mydashboard.json

This will show the definitions from the mydashboard.json file. If no file is specified the standard teamwall.json file will be
loaded.

You need a browser with a working HTML 5 canvas to use this.

For a very quick example checkout the [demo directory](teamwall/tree/master/demo).

## Example ##

Create a teamwall.json file looking like this:

	
	{
        "layouts": [
            {
                "id": "codecoverage",
                "top": 0,
                "left": 0,
                "width": 300,
                "height": 300
            }
        ],
        "instruments": [
            {
                "id":"codecoverage",
                "instrument":"percent",
                "title":"Code Coverage",
                "url":"data/codecoverage.json",
                "threshold_value":80,
                "higher_is_better":true
            }
        ]
    }
	
This will render a percentage instrument at 0,0 (top left corner) with a width and height of 300 pixel.

Now create a `data/codecoverage.json` file (data directory needs to be created) with the following content:

	{"value":"81.8", "trend":"1"}

Hurray! You got your first Teamwall Dashboard. Now go and change the value and switch back to the browser.

## Instruments ##

### Attributes of all Instruments ###

Instruments are defined the the `instruments` section of the configuration file.

|Attribute | Definition| 
|----------|-----------|
| instrument | Name of the instrument to use, can be any of the instrument names below
| id | Id of the instrument
| url | Url to get updated data

All data from the data urls need to be in json format.

### Percent Instrument ###

**Instrument name :** percent

| Attribute | Definition |
|-----------|------------|
| title	|Title of the instrument |
| threshold_value | If the value from the data url is below the threshold the display will be rendered as failure |
| higher_is_better | If set to true, the higher the value the 'greener' the result is, otherwise the more it gets to zero the better it is |

####100 is good####

Example:
	
	{
		"instrument":"percent",
        "id":"codecoverage",
        "title":"Code Coverage",
        "url":"data/codecoverage.json",
        "threshold_value":80.
        "higher_is_better": true
    }

####0 is good####

If your target is 0 percent you can set `higher_is_better` to false. In this case a value below the threshold will be
displayed as warning. A value above the threshold will be displayed as failure.

Example:

    {
        "instrument":"percent",
        "id":"xs",
        "title":"XS",
        "url":"data/xs.json",
        "threshold_value":5,
        "higher_is_better":false
    }

![0 percent is good - failure](https://raw.github.com/40bits/teamwall/master/documentation/images/percent_0_is_good_failure.png "0 percent is good - failure")
![0 percent is good - warning](https://raw.github.com/40bits/teamwall/master/documentation/images/percent_0_is_good_warning.png "0 percent is good - warning")

#### Data Format ####

| Attribute | Definition |
|-----------|------------|
| value | The value to be displayed |
| trend | The trend of the value |
| threshold_value | The new threshold value (optional) |


Where trend is defined as this:

|Trend Value | Definition |
|------------|------------|
| 1 | Better value than previous |
| 0 | Same value as previous |
| -1 | Worse value than previous |

The meaning of better and worse is depending on the attribute `higher_is_better`.

Example:

	{"value":"82.2", "trend":"1", "threshold_value":"90"}


#### Examples ####

![Green](https://raw.github.com/40bits/teamwall/master/documentation/images/percent_green.png "Green Percent")
![Red](https://raw.github.com/40bits/teamwall/master/documentation/images/percent_red.png "Red Percent")


### Buildchain Instrument ###

**Instrument name :** buildchain


Example:

	{
        "instrument":"buildchain",
        "id":"buildchain",
        "url":"data/buildchain.json"
    }


#### Data Format ####

The format consists of a list of build steps.

| Attribute | Definition |
|-----------|------------|
| name | Name of the build step |
| status | FAILURE or SUCCESS |

There can be as many buid steps as needed.

Example:

	[ 
		{ "name":"unit tests", "status":"SUCCESS" }, 
		{ "name":"deploy preview", "status":"SUCCESS" },
		{ "name":"selenium preview", "status":"FAILURE" },
		{ "name":"documentation", "status":"SUCCESS" }, 
		{ "name":"deploy integration", "status":"SUCCESS" },
		{ "name":"smoke integration", "status":"SUCCESS" } 
	]

#### Example ####

![Red](https://raw.github.com/40bits/teamwall/master/documentation/images/buildchain.png "Build Chain")

### Build Alert Instrument ###

**Instrument name :** buildalert

This instrument is used to monitor multiple build chains. If one team has more than one product (and therefore chain) it
can take up a lot of screen estate. If you have the need for multiple chains, this instrument is for you.

Example:

	{
        "instrument":"buildalert",
        "id":"buildalert",
        "url":"data/buildalert.json"
    }


#### Data Format ####

A list of build chains can be defined.

| Attribute | Definition |
|-----------|------------|
| name | Name of the build chain |
| chain | Definition of the chain |

| Attribute | Definition |
|-----------|------------|
| name | Name of the build step |
| status | FAILURE or SUCCESS |

There can be as many buid steps as needed.

Example:

	[
    {
      "name":"Build1",
      "chain":
              [
                { "name":"unit tests", "status":"SUCCESS" },
                { "name":"deploy preview", "status":"SUCCESS" },
                { "name":"selenium preview", "status":"FAILURE" },
                { "name":"documentation", "status":"SUCCESS" },
                { "name":"deploy integration", "status":"SUCCESS" },
                { "name":"smoke integration", "status":"SUCCESS" }
              ]
    },
    {
      "name":"Build2",
      "chain":
              [
                { "name":"Mega Tests", "status":"SUCCESS" },
                { "name":"prod tests", "status":"FAILURE" },
                { "name":"live tests", "status":"SUCCESS" }
              ]
    }
  ]


#### Example ####

![Red](https://raw.github.com/40bits/teamwall/master/documentation/images/buildalert_red.png "Build Alert Red")
![Green](https://raw.github.com/40bits/teamwall/master/documentation/images/buildalert_green.png "Build Alert Green")



### Number Instrument ###

**Instrument name :** number


| Attribute | Definition |
|-----------|------------|
| title	|Title of the instrument |
| threshold_value | If the value from the data url is below the threshold the display will be rendered as failure |
| decimal_places | How many decimal places should be rendered|
| higher_is_better | The higher number is good and will be rendered as success
| unit | Which unit should be rendered (not yet implemented)|
| show_trend| True or false is the trend should be rendered|

Example:

	{
	 "instrument":"number",
	 "id":"violations",
	 "title":"Code Violations",
	 "url":"data/codeviolations.json",
	 "threshold_value":"5",
 	 "decimal_places":"0",
 	 "higher_is_better":false,
	 "unit":"#",
	 "show_trend": true
	}

#### Data Format ####

| Attribute | Definition |
|-----------|------------|
| value | The value to be displayed |
| trend | The trend of the value |
| threshold_value | The new threshold value (optional) |


Where trend is defined as this:

|Trend Value | Definition |
|------------|------------|
| 1 | Bigger value than previous |
| 0 | Same value as previous |
| -1 | Smaller value than previous |


Example:

	{"value":"9", "trend":"0", "threshold_value":"11"}
	
![RedNumber](https://raw.github.com/40bits/teamwall/master/documentation/images/number_red.png "Red Number")
![GreenNumber](https://raw.github.com/40bits/teamwall/master/documentation/images/number_green.png "Green Chain")

### TextArea ###

**Instrument name :** textarea

This instrument will simply show the text given to it. It tries to fill the maximum space and auto computes the best font size so everything fits into the instrument space.

No extra configuration besides id and url.

#### Data Format ####

| Attribute | Definition |
|-----------|------------|
| value     | The text to be displayed |

Example:

	{"value":"Hello World"}
	
![TextArea](https://raw.github.com/40bits/teamwall/master/documentation/images/textarea.png "Text Area")	


# Layout #

The layout is defined the the `layouts` section of the configuration file.

The id must match to one of the instruments defined in the `instrument` section. According to that the instrument will have an `width` and `height` and is positioned at `top` and `left`.

| Attribute | Definition |
|-----------|------------|
| id        | id of the instrument |
| width     | Width of the instrument | 
| height    | Height of the instrument |
| top       | distance from top of the screen |
| left      | distance from the left of the screen |

Example :


	 "layouts": [
        {
            "id": "codecoverage",
            "top": 0,
            "left": 0,
            "width": 300,
            "height": 300
        },
      ]
       
	
# TODO #

- More Instruments 
