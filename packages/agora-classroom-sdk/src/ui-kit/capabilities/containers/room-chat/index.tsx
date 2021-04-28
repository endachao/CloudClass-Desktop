import { Chat, Icon } from '~components'
import { observer } from 'mobx-react'
import * as React from 'react';
import { useChatContext, useGlobalContext, useRoomContext } from 'agora-edu-core';
import { useCallback, useEffect } from 'react';
import { get } from 'lodash';

// const useRoomChat = (store: RoomChatUIKitStore) => {

//   const {
//     isHost,
//     uid:meUid,
//     canChatting,
//     collapse,
//     messages: messageList,
//     chatText,
//   } = store

//   return {
//     isHost,
//     meUid,
//     canChatting,
//     collapse,
//     messageList,
//     chatText,
//     onCanChattingChange: (canChatting: boolean) => {
//       store.setCanChatting(canChatting)
//     },
//     onChangeText: (text: string) => {
//       store.setChatText(text)
//     },
//     onChangeCollapse: () => {
//       store.toggleCollapse()
//     },
//     refreshMessageList: async () => {
//       await store.refreshMessageList()
//     },
//     handleSendText: async () => {
//       await store.handleSendText()
//     },
//     handleClickMinimize: async () => {
//       await store.toggleMinimize()
//     },
//     unreadMessageCount: store.unreadCount,
//   }
// }

export const RoomChat = observer(() => {

  const {
    chatCollapse,
    canChatting,
    isHost,
    getHistoryChatMessage,
    unreadMessageCount,
    muteChat,
    unmuteChat,
    toggleChatMinimize,
    messageList,
    sendMessage,
    addChatMessage
  } = useChatContext()

  const {
    roomInfo
  } = useRoomContext()

  const {
    isFullScreen
  } = useGlobalContext()

  useEffect(() => {
    if ((isFullScreen && !chatCollapse) || (!isFullScreen && chatCollapse)) {
      // 第一个条件 点击全屏默认聊天框最小化
      // 第二个条件，全屏幕最小化后，点击恢复（非全屏），恢复聊天框
      toggleChatMinimize()
    }
  }, [isFullScreen])

  const [nextId, setNextID] = React.useState('')

  const isMounted = React.useRef<boolean>(true)


  const refreshMessageList = useCallback(async () => {
    const res = nextId !== 'last' && await getHistoryChatMessage({ nextId, sort: 0 })
    if (isMounted.current) {
      setNextID(get(res, 'nextId', 'last'))
    }
  }, [nextId, setNextID, isMounted.current])

  React.useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  const onCanChattingChange = async (canChatting: boolean) => {
    if (canChatting) {
      await muteChat()
    } else {
      await unmuteChat()
    }
  }

  const [text, setText] = React.useState<string>('')

  const handleSendText = useCallback(async (): Promise<void> => {
    if (!text.trim()) return;
    const textMessage = text
    setText('')
    const message = await sendMessage(textMessage)
    addChatMessage(message)
  }, [text, setText])
  
  return (
    <Chat
      className="small-class-chat"
      collapse={chatCollapse}
      onCanChattingChange={onCanChattingChange}
      canChatting={canChatting}
      isHost={isHost}
      uid={roomInfo.userUuid}
      messages={messageList}
      chatText={text}
      onText={(textValue: string) => {
        setText(textValue)
      }}
      onCollapse={() => {
        toggleChatMinimize()
      }}
      onSend={handleSendText}
      showCloseIcon={isFullScreen}
      onPullFresh={refreshMessageList}
      unreadCount={unreadMessageCount}
    />
  )
})