const accountSid = "ACed0c2dbf4adb4dcdc81ddda3ec87b4e9";
const authToken = "02233869dfaec37fe4dfd1812725485f";
const client = require("twilio")(accountSid, authToken);
export const whatsappMessage = async (theToNumber, theMessage) => {
  try {
    return await client.messages
      .create({
        from: "whatsapp:+14155238886",
        contentSid: "HXb5b62575e6e4ff6129ad7c8efe1f983e",
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: `whatsapp:${theToNumber}`,
        body: theMessage,
      })
      .then((message) => {
        console.log(message);
        return message;
      })
      .done();
  } catch (error) {
    throw new Error(error?.message);
  }
};
