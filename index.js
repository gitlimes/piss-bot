import "dotenv/config";
import { createRestAPIClient } from "masto";
import { createStreamingAPIClient } from "masto";

const mastoStream = createStreamingAPIClient({
    streamingApiUrl: `wss://${process.env.INSTANCE_URL}/api/v1/streaming`,
    accessToken: process.env.BOT_ACCESS_TOKEN,
});

const mastoREST = createRestAPIClient({
    url: `https://${process.env.INSTANCE_URL}`,
    accessToken: process.env.BOT_ACCESS_TOKEN
})

async function toot(event) {

    const { acct: pisser} = event.payload.account;
    const { url: pisserToot, visibility, id } = event.payload.status;

    const heyEveryone = `hey everyone check this out, @${pisser} said piss`;

    const toot = `${heyEveryone}\n\n${pisserToot}`;

    const status = await mastoREST.v1.statuses.create({
        status: toot,
        visibility: visibility,
        in_reply_to_id: id
    });

    console.log(`Tooted on ${new Date()}! ${status?.url}`);
}

const subscribe = async () => {
  console.log("subscribed to notifications");

  for await (const event of mastoStream.user.notification.subscribe()) {
    const { content } = event.payload.status;
    if (content.includes("piss") && content.includes(process.env.YOUR_ACCOUNT_URL_IN_MENTIONS)) {
        toot(event);
    }
  }
};

try {
  await subscribe();
} catch (error) {
  console.error(error);
}




