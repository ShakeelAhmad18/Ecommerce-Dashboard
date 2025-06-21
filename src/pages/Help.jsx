import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiMessageSquare,
  FiMoreVertical,
  FiPaperclip,
  FiMic,
  FiSmile,
  FiSend,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import Avatar from "react-avatar";

const HelpDesk = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      lastMessage: "I was charged twice for my purchase",
      unread: 2,
      status: "active",
      lastSeen: "2023-05-15T10:30:00",
      messages: [
        {
          id: 1,
          text: "Hello, I was charged twice for my purchase",
          sender: "user",
          time: "2023-05-15T10:30:00",
          status: "read",
        },
        {
          id: 2,
          text: "Can you help me with this issue?",
          sender: "user",
          time: "2023-05-15T10:31:00",
          status: "read",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      lastMessage: "How do I reset my password?",
      unread: 0,
      status: "active",
      lastSeen: "2023-05-15T09:15:00",
      messages: [
        {
          id: 1,
          text: "I forgot my password, how can I reset it?",
          sender: "user",
          time: "2023-05-15T09:15:00",
          status: "read",
        },
        {
          id: 2,
          text: "We can help with that. Check your email for a reset link.",
          sender: "admin",
          time: "2023-05-15T09:20:00",
          status: "delivered",
        },
      ],
    },
  ]);

  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef(null);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [selectedContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const updatedContacts = contacts.map((contact) => {
      if (contact.id === selectedContact.id) {
        const newMsg = {
          id: contact.messages.length + 1,
          text: newMessage,
          sender: "admin",
          time: new Date().toISOString(),
          status: "sent",
        };

        return {
          ...contact,
          lastMessage: newMessage,
          messages: [...contact.messages, newMsg],
          unread: 0,
        };
      }
      return contact;
    });

    setContacts(updatedContacts);
    setSelectedContact(
      updatedContacts.find((c) => c.id === selectedContact.id)
    );
    setNewMessage("");

    // Simulate message delivery status update
    setTimeout(() => {
      const deliveredContacts = updatedContacts.map((contact) => {
        if (contact.id === selectedContact.id) {
          return {
            ...contact,
            messages: contact.messages.map((msg) =>
              msg.status === "sent" ? { ...msg, status: "delivered" } : msg
            ),
          };
        }
        return contact;
      });

      setContacts(deliveredContacts);
      if (selectedContact) {
        setSelectedContact(
          deliveredContacts.find((c) => c.id === selectedContact.id)
        );
      }
    }, 1000);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Contacts sidebar */}
      <div
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-full md:w-96 flex-shrink-0 ${
          isMobileView && selectedContact ? "hidden" : "block"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Support Inbox
          </h1>
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedContact?.id === contact.id
                  ? "bg-blue-50 dark:bg-gray-700"
                  : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="relative">
                <Avatar
                  name={contact.name}
                  size="48"
                  round={true}
                  className="border-2 border-white dark:border-gray-700"
                />
                {contact.status === "active" && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(contact.lastSeen).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unread > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`flex-1 flex flex-col ${
          isMobileView && !selectedContact ? "hidden" : "flex"
        }`}
      >
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
              {isMobileView && (
                <button
                  onClick={() => setSelectedContact(null)}
                  className="mr-2 text-gray-500 dark:text-gray-400"
                >
                  <IoIosArrowBack size={24} />
                </button>
              )}
              <Avatar
                name={selectedContact.name}
                size="40"
                round={true}
                className="border-2 border-white dark:border-gray-700"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {selectedContact.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  {selectedContact.status === "active" ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </>
                  ) : (
                    `Last seen ${new Date(
                      selectedContact.lastSeen
                    ).toLocaleString()}`
                  )}
                </p>
              </div>
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <FiMoreVertical />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
              {selectedContact.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                      message.sender === "admin"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-600 text-gray-800 dark:text-white rounded-bl-none"
                    }`}
                  >
                    <p>{message.text}</p>
                    <div
                      className={`text-xs mt-1 flex items-center ${
                        message.sender === "admin"
                          ? "text-blue-100 justify-end"
                          : "text-gray-500 dark:text-gray-300"
                      }`}
                    >
                      {new Date(message.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {message.sender === "admin" && (
                        <span className="ml-1">
                          {message.status === "sent" && (
                            <FiCheck className="inline" />
                          )}
                          {message.status === "delivered" && (
                            <>
                              <FiCheck className="inline" />
                              <FiCheck className="inline -ml-1" />
                            </>
                          )}
                          {message.status === "read" && (
                            <>
                              <FiCheck className="inline text-blue-300" />
                              <FiCheck className="inline -ml-1 text-blue-300" />
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2">
                  <FiSmile />
                </button>
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2">
                  <FiPaperclip />
                </button>
                <input
                  type="text"
                  className="flex-1 mx-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                {newMessage ? (
                  <button
                    onClick={handleSendMessage}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                  >
                    <FiSend />
                  </button>
                ) : (
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2">
                    <FiMic />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <div className="text-center p-6">
              <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-white">
                Select a conversation
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Choose a contact from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpDesk;
