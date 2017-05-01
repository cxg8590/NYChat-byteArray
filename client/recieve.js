
const recieveMessage = (data) => {
    let totalOffset = 0;
    
    const decoder = new TextDecoder();
    const myData = new DataView(data);
    const userLength = myData.getInt8();
    
    totalOffset += 1;
    
    const userView = new DataView(data, 1, userLength);
    const user = decoder.decode(userView);
    totalOffset += userLength;
    totalOffset += 1;
    console.log("user: " + user + ", data: "+userLength);
    
    const messView = new DataView(data, totalOffset);
    const mess = decoder.decode(messView);
    
    chat.value += user + ": " + mess + "\n";
};