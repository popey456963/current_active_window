# Current Active Window

At the moment, this program consists of three main programs:

### Active Window Grabber

**File**: new_index.js
**Start**: node new_index.js

This application retrieves the current active window and saves it to an InfluxDB database hosted locally.  Add your own programs in `groups.hjson` and alter the state decisions in `state.js`

### Database Querier

**File**: query_index.js
**Start**: node query_index.js

This application queries the database for every program run on that day, it sends this over to the display module.  You'll need to edit `query_index.js` to point this to your host.

### Query Displayed

**File**: graph.js
**Start**: node graph.js

This application graphs the retrieved data in a pretty doughnut table.

![](https://puu.sh/xDbwu/fc29df614a.png)