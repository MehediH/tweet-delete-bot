const Twit = require("twit");
const config = require("./config");
const screen_name = process.env.SCREEN_NAME;

const bot = new Twit(config);
const jan13_2022 = 1642069781272;

const getLikesAndDelete = async () => {
  const data = await bot.get("favorites/list", {
    screen_name: screen_name,
    count: 1,
  });

  if (!data.data) return;

  const likes = data.data;

  // We get all likes after the given time, in this case jan13_2022
  const filteredLikes = likes.filter(
    (t) => new Date(t.created_at).getTime() > jan13_2022
  );

  const deleteLikes = filteredLikes.map(async (t) => {
    await bot.post("favorites/destroy", {
      id: t.id_str.toString(),
    });
  });

  // delete and await
  await Promise.all(deleteLikes);
};

getLikesAndDelete();
