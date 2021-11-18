import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import { recoilPersist } from "recoil-persist";
import {chatsActions} from "./ChatAppAPI"


export const { persistAtom } = recoilPersist({});
export const connectedUser = atom({
  key: "connectedUser",
  default: { username: "", userId: "", profilePhoto: "" },
  effects_UNSTABLE: [persistAtom]
});
export const selectedChat = atom({
  key: "selectedChat", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const chatMessgesState = selector({
  key: "chatMessgesState",
  get: async ({ get }) => {
    const chatDesc = get(selectedChat);
    let chat = false
    if(chatDesc !== ""){
      console.log(chatDesc);
      chat = await chatsActions.getChat('/chats', chatDesc.chatId);
    }

    return chat;
  },
});
