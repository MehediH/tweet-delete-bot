const Twit = require("twit");
const config = require("./config");
const screen_name = process.env.SCREEN_NAME;

const bot = new Twit(config);
const jan13_2022 = 1641050207000;

const filterTweets = ["1481378019562250240"];

const getLikesAndDelete = async () => {
  const data = await bot.get("favorites/list", {
    screen_name: screen_name,
    count: 200,
  });

  if (!data.data) return;

  const likes = data.data;

  // We get all likes after the given time, in this case jan13_2022
  const filteredLikes = likes.filter(
    (t) =>
      new Date(t.created_at).getTime() > jan13_2022 &&
      !filterTweets.includes(t.id_str)
  );

  let i = 0;

  console.log(
    `Found ${filteredLikes.length} tweets at ${new Date(
      Date.now()
    ).toISOString()}`
  );

  const deleteLikes = filteredLikes.map(async (t) => {
    await bot
      .post("favorites/destroy", {
        id: t.id_str.toString(),
      })
      .catch((e) => {
        console.log(`Couldn't delete tweet ${t.id_str.toString()}`, e.message);
      })
      .then(() => {
        i += 1;
      });
  });

  // delete and await
  await Promise.all(deleteLikes);

  console.log(`Deleted ${i} tweets at ${new Date(Date.now()).toISOString()}`);
};

getLikesAndDelete();
