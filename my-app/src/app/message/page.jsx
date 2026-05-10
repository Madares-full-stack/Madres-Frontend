"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/api";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const Page = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [content, setContent] = useState("");
  const [myId, setMyId] = useState("");

  const socketRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    const id = localStorage.getItem("userId");

    setMyId(id ? id.replace(/"/g, "") : "" );
  }, []);
 useEffect(() => {
  if (!myId) return;

  socketRef.current = io("http://localhost:5000");

  socketRef.current.on("connect", () => {
    socketRef.current.emit("register", myId);
  });

  const handler = (msg) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === msg._id);

      if (exists) return prev;

      return [...prev, msg];
    });
  };

  socketRef.current.on("receive_message", handler);

  return () => {
    socketRef.current.off("receive_message", handler);
    socketRef.current.disconnect();
  };
}, [myId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/myChat");

        setUsers(res.data.users);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchUsers();
  }, []);

  const openChat = async (user) => {
    setSelectedUser(user);

    try {
      const res = await api.get(`/messages?userId=${user._id}`);

      setMessages(res.data.messages);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sendMessage = async () => {
    if (!content.trim() || !selectedUser) return;

    try {
     const res = await api.post("/messages", {
        receiver: selectedUser._id,
        content,
      });
     setMessages((prev) => [...prev, res.data.message]);
      setContent("");
      inputRef.current?.focus();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const res = await api.delete(`/messages/${id}`);

      setMessages((prev) => prev.filter((m) => m._id !== id));

      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const updateMessage = async (id) => {
    try {
      const res = await api.put(`/messages/${id}`, {
        content: editContent,
      });

      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, content: editContent } : m)),
      );

      toast.success("Message updated");

      setEditingId(null);
      setEditContent("");
      setOpenMenu(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-fluid chat-container">
      <div className="row h-100">
        <div className="col-3 chat-sidebar p-0">
          <div className="p-3 border-bottom">
            <h5>Chats</h5>
          </div>

          {users.map((u) => (
            <div
              key={u._id}
              className={`chat-user ${
                selectedUser?._id === u._id ? "active" : "text-white"
              }`}
              onClick={() => openChat(u)}
            >
              {u.name}
            </div>
          ))}
        </div>

        <div className="col-9 chat-main p-0">
          {selectedUser ? (
            <>
              <div className="chat-header p-3 text-white">
                <strong>{selectedUser.name}</strong>
              </div>

              <div className="chat-messages">
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className={`message ${
                      String(m.sender?._id) === String(myId) ? "me" : "other"
                    }`}
                  >
                    <div className="position-relative">
                      {editingId === m._id ? (
                        <div className="d-flex gap-2">
                          <input
                            className="form-control"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateMessage(m._id)}
                          >
                           💾
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditingId(null);
                              setEditContent("");
                            }}
                          >
                           ❌
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <span>{m.content}</span>
                          {String(m.sender?._id) === String(myId) && (
                            <div className="position-relative">
                              <button
                                className="btn btn-sm text-white"
                                onClick={() =>
                                  setOpenMenu(openMenu === m._id ? null : m._id)
                                }
                              >
                               <i className="bi bi-three-dots-vertical"> </i>
                              </button>
                              {openMenu === m._id && (
                                <div
                                  className="position-absolute bg-dark p-2 rounded"
                                  style={{
                                    right: 0,
                                    zIndex: 100,
                                    minWidth: "120px",
                                  }}
                                >
                                  <button
                                    className="dropdown-item text-white"
                                    onClick={() => {
                                      setEditingId(m._id);
                                      setEditContent(m.content);
                                      setOpenMenu(null);
                                    }}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                      deleteMessage(m._id);
                                      setOpenMenu(null);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input p-2 d-flex gap-2">
                <input
                  ref={inputRef}
                  className="form-control"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type message..."
                />

                <button className="btn btn-success" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-white">
              <h5>Select a chat</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
