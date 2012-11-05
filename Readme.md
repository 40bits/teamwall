# Teamwall

__The developers dashboard.__

This is the early stages Teamwall project.

Teamwall is a small dashboard the a team that develops software.

**Basic idea**

Show the developer the information he needs to know how the code is doing.

**What can that be**

Code Coverage, Live stats from servers, Incoming bugs etc.


# Get started #

Put everything in a directory served by a web server. You can also run
`node server.js` which will start a server on port 8888. Find below a list of instruments which can be used to visualize ctitical information.

What `you` need to do is to create a `teamwall.json` file and put it into the root directory of teamwall. This file contains the description of the instruments to be shown (and how they are updated). Every 15 seconds the values are updated. It is totally up to you where to get the data from, Teamwall simply reads the urls and displays it's json data.

You need a browser with a working HTML 5 canvas to use this.

## Example ##

Create a teamwall.json file looking like this:

	[
    	{
       	 "instrument":"percent",
       	 "width":"500",
       	 "height":"200",
       	 "id":"codecoverage",
       	 "title":"Code Coverage",
       	 "url":"data/codecoverage.json",
       	 "threshold_value":80
    	}
	]
	
Create a `data/codecoverage.json` file (data directory needs to be created) with the following content:

	{"value":"81.8", "trend":"1"}

Hurray! You got your first Teamwall Dashboard.


## Instruments ##

### Attributes of all Instruments ###

|Attribute | Definition| 
|----------|-----------|
| instrument | Name of the instrument to use, can be any of the instrument names below
| width | Width of the instrument 
| height | Height of the instrument
| id | Id of the instrument
| url | Url to get updated data

All data from the data urls need to be in json format.

### Percent Instrument ###

**Instrument name :** percent

| Attribute | Definition |
|------------------------|
| title	|Title of the instrument |
| threshold_value | If the value from the data url is below the threshold the display will be rendered as failure |

Example:
	
	{
		"instrument":"percent",
        "width":"500",
        "height":"200",
        "id":"codecoverage",
        "title":"Code Coverage",
        "url":"data/codecoverage.json",
        "threshold_value":80
    }


#### Data Format ####

| Attribute | Definition |
|------------------------|
| value | The value to be displayed |
| trend | The trend of the value |


Where trend is defined as this:

|Trend Value | Definition |
|-------------------------|
| 1 | Bigger value than previous |
| 0 | Same value as previous |
| -1 | Smaller value than previous |

Example:

	{"value":"82.2", "trend":"1"}


#### Examples ####

![Green](documentation/images/percent_green.png "Green Percent")
![Red](documentation/images/percent_red.png "Red Percent")


### Buildchain Instrument ###

**Instrument name :** buildchain


Example:

	{
        "instrument":"buildchain",
        "width":"300",
        "height":"300",
        "id":"buildchain",
        "url":"data/buildchain.json"
    }


#### Data Format ####

The format consists of a list of build steps.

| Attribute | Definition |
|------------------------|
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

![Red](documentation/images/buildchain.png "Build Chain")


### Number Instrument ###

**Instrument name :** number


| Attribute | Definition |
|------------------------|
| title	|Title of the instrument |
| threshold_value | If the value from the data url is below the threshold the display will be rendered as failure |
| decimal_places | How many decimal places should be rendered|
| higher_is_better | The higher number is good and will be rendered as success
| unit | Which unit should be rendered|
| show_trend| True or false is the trend should be rendered|

Example:

	{
	 "instrument":"number",
	 "width":"300",
	 "height":"300",
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
|------------------------|
| value | The value to be displayed |
| trend | The trend of the value |


Where trend is defined as this:

|Trend Value | Definition |
|-------------------------|
| 1 | Bigger value than previous |
| 0 | Same value as previous |
| -1 | Smaller value than previous |


Example:

	{"value":"9", "trend":"0"}
	
![RedNumber](documentation/images/number_red.png "Red Number")
![GreenNumber](documentation/images/number_green.png "Green Chain")
	
# TODO #

- Better Layouting options
- More Instruments 