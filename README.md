# Campaign IDs

_A quick tool to generate unique campaign IDs from common analytics query parameters._

Live here: https://tmoravec.github.io/campaign-ids/


### Introduction

Frontend analytics solutions like _Google Analytics_ or _Matomo_ use various query string
parameters to distinguish individual marketing campaigns.

For instance, marketing campaign drives clicks to a URL like this:

`https://cool-site.com?utm_campaign=campaign1&utm_source=source3`

The data in the `utm_campaign` and `utm_source` variables is then picked up by Google Analytics.
Google Analytics can, in turn, provide the marketers with all kinds of useful data on the users' behavior. 
The users can be grouped by these parameters so marketers can understand the difference between
users coming through different campaigns, and compare the campaigns' performance.

The list of such query parameters is somewhat extensive. Different service providers use different names, too.
So we can end up using some or all of these, and possibly even more:

* `utm_source`
* `utm_medium`
* `utm_campaign`
* `pk_campaign`
* `piwik_campaign`
* `pk_kwd`
* `piwik_kwd`
* `pk_keyword`
* `utmTerm`

If we need to track the campaigns' performance at the Backend, remembering all
of these variables for every user is unwieldy. And makes filtering difficult.
And it's even worse if the Backend consists of many microservices.

### Solution

I propose computing a single identifier (number) for every campaign. This number would reflect
all the variables, so it is unique to the campaign. But all users from
the campaign would end up with the same number.

The Frontend can compute this campaign_id and send it to the Backend when creating
the user account. The Backend then keeps track of the single number.

This approach makes it difficult for the marketing people to map the campaign
parameters to the campaign_id. And this is what this tool solves. It generates
unique campaign_id for all kinds of URLs and query parameter combinations.

### Consistency

It's evident that the algorithm to generate the campaign IDs needs to be the same
in the application Frontend and this helper tool.

### Algorithm

This solution computes an md5 hash of the parameters, and takes the last three Bytes. 
That gives 16,777,216 combinations which should be enough to avoid collisions, while not
overloading the Backend database with needless amounts of data.
