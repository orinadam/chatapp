### Chatters Map
```js
const chatters = new Map;
```

### Middleware
```js
app.use((req, res, next) => {
    req.chatters = chatters;
    next();
});
```

### Websocket - Backend
```js
app.ws("/", (ws, req) => {
    ws.on("message", (message) => {
        const parsed = JSON.parse(message);
        // {op: "IDENTIFY", d: {token: "!@$12124124124"}}
        switch (parsed.op) {
            case "IDENTIFY":
                // token valid?
                // {op: "ERROR", d: {message: "Invalid creds"}}
                // send this ^

                // if is valid ->
                // extract the data the token
                const chatter = new Chatter(ws, dataFromToken);
                chatters.set(dataFromToken.id, chatter);
                break;
        }
    });
});
```

#### Chatter
```js
class Chatter {
    constructor (connection, data) {
        this.connection = connection;
        this.user = data;
    }
}
```

### In A Router
```js
router.post("message-post", (...) => {
    // ...
    // message processing above

    const chatter = req.chatters.get(targetId);

    if (!chatter) {
        // return error
    }

    chatter.connection.send({
        op: "MESSAGE_CREATE",
        d: {
            content: messageContent
        }
    });
});
```

### In The Frontend
```jsx
function MyChatComponent () {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const connection = new W3CWebsocket("ws://....");

        connection.onopen = () => {
            setConnection(connection);

            // Identify to the websocket server
            connection.send({
                op: "IDENTIFY",
                d: {
                    token: cookieCutter.get("authorization");
                }
            })
        }

        connection.onmessage = (m) => {
            const parsed = JSON.parse(m);

            switch (m.op) {
                case "MESSAGE_CREATE":
                    setMessages(currentState => {
                        return [...currentState, m.d.content];
                    });

                    break;
                case "ERROR":
                    // there was an error with the websocket authentication
                    // let's just redirect to the homepage
                    connection.close();
                    document.location.href = "/"
                    break;
                default:
                    console.log("unknown op")
            }
        }
    }, []);

    return (
        {
            messages.map(m => {
                return <p>{m}</p>
            })
        }
    )
}
```
