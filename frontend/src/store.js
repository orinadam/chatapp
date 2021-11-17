import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';

export const connectedUser = atom({
    key: 'connectedUser',
    default: {username: '', userId: '', profilePhoto: ""}

})
export const selectedUser = atom({
    key: 'selectedUser', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
  });

  export const chatMessgesState = selector({
    key: 'chatMessgesState',
    get: ({get}) => {
      const user = get(selectedUser);
      
      return ;
    },
  });