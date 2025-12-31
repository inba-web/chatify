import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceHolder from "./NoChatHistoryPlaceHolder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";


const ChatContainer = () => {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w--3xl mx-auto space-y-6">
            {messages.map((msg) => {
              <div
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                key={msg._id}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser.id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover"/>
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  {new Date(msg.createdAt).toISOString().slice(11,16)} 
                </div>
              </div>;
            })}
          </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
          <NoChatHistoryPlaceHolder name={selectedUser.fullName} />
        )} x``
      </div>
      
      <MessageInput /> 
    </>
  );
};

export default ChatContainer;
