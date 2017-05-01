

// Player class
class Message {
  constructor(user, mess) {
    this.user = user; // character's unique id
    this.mess = mess;


    // last time this character was updated
    this.lastUpdate = new Date().getTime();
  }

  static toMessage(mesObj) {
    let totalLength = 0;

    const userBuffer = Buffer.from(mesObj.user, 'utf-8');
    const userLength = userBuffer.byteLength;
    totalLength += userLength;

    const messBuffer = Buffer.from(mesObj.mess, 'utf-8');
    const messLength = messBuffer.byteLength;
    totalLength += messLength;

    let offset = 0;

    const outMessage = Buffer.alloc(totalLength + 2);

    outMessage.writeInt8(userLength);
    console.log(`outMessage: ${outMessage}`);
    console.log(`userlength: ${userLength}`);
    offset += 1;
    userBuffer.copy(outMessage, offset);
    offset += userLength;

    outMessage.writeInt8(messLength, offset);
    offset += 1;
    messBuffer.copy(outMessage, offset);
    offset += messLength;

    console.log(`outMessage: ${outMessage}`);

    return outMessage;
  }
}

module.exports = Message;
