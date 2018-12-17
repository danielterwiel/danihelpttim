require("dotenv").config();
const Twit = require("twit");

const isReply = twitter =>
  tweet.retweeted_status ||
  tweet.in_reply_to_status_id ||
  tweet.in_reply_to_status_id_str ||
  tweet.in_reply_to_user_id ||
  tweet.in_reply_to_user_id_str ||
  tweet.in_reply_to_screen_name;

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  ACCESS_TOKEN,
  ACCESS_TOKEN_SECRET
} = process.env;

const T = new Twit({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

const SCREEN_NAME = "debroervanroos";
const USER_ID = "65881225";

T.get(
  "statuses/user_timeline",
  {
    user_id: USER_ID,
    include_rts: false,
    exclude_replies: true,
    trim_user: true,
    count: 200
  },
  (err, data, response) => {
    const tweetsOnly = data.filter(tweet => isReply);
    const tweets = tweetsOnly.map(tweet => tweet.text);
    const tweetCount = tweets.length;
    console.log("Tweets:\n");
    const results = tweets.reduce(
      (accumulator, tweet) => {
        console.log(tweet);
        const ikCount = (accumulator.ikCount += (
          tweet.match(/ik/g) || []
        ).length);
        const wordCount = (accumulator.wordCount += tweet
          .trim()
          .split(/\s+/).length);
        return {
          ikCount,
          wordCount
        };
      },
      {
        ikCount: 0,
        wordCount: 0
      }
    );

    console.log("\n\n\n");
    console.log(
      `Het woord 'ik' is ${results.ikCount.toString()} gevonden in de ${tweetCount} laatste tweets van @${SCREEN_NAME}
      Met als gevolg dat de ik-dichtheid in de het totaal aantal woorden in zijn tweets (${
        results.wordCount
      }) van zijn ${(
        results.ikCount / results.wordCount
      ).toString()} % bedraagt`
    );
  }
);
