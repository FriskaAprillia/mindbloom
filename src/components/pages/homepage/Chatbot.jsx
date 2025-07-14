import React, { useState, useRef, useEffect } from "react";

const Chatbot = ({
   messages = [],
   onSendMessage,
   placeholder = "Masukan pesan...",
}) => {
   const [inputValue, setInputValue] = useState("");
   const messagesEndRef = useRef(null);

   // Scroll to the bottom of the chat when messages change
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   const handleInputChange = (event) => {
      setInputValue(event.target.value);
   };

   const handleSendMessage = () => {
      if (inputValue.trim() && onSendMessage) {
         onSendMessage(inputValue.trim());
         setInputValue("");
      }
   };

   const handleKeyPress = (event) => {
      if (event.key === "Enter") {
         handleSendMessage();
      }
   };

   return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
         <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
               <div
                  key={index}
                  className={`flex ${
                     message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
               >
                  <div
                     className={`max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                           ? "bg-[#898AC4] text-white"
                           : "bg-gray-200 text-gray-800"
                     }`}
                  >
                     <span
                        dangerouslySetInnerHTML={{
                           __html: message.text.replace(
                              /\*(.*?)\*/g,
                              "<strong>$1</strong>"
                           ),
                        }}
                     />
                  </div>
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         {/* Message Input Area */}
         <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center">
            <input
               type="text"
               className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
               placeholder={placeholder}
               value={inputValue}
               onChange={handleInputChange}
               onKeyPress={handleKeyPress}
            />
            <button
               onClick={handleSendMessage}
               className="ml-3 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
               aria-label="Send message"
            >
               {/* Using an SVG for the upward arrow icon */}
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 transform rotate-90" // Rotate for upward arrow
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
               </svg>
            </button>
         </div>
      </div>
   );
};

export default Chatbot;
