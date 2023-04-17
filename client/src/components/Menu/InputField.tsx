/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, FC, useRef } from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import "./InputField.css";
import SkinSelection from "./SkinSelection";

interface InputFieldProps {
  setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConnectionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputField: FC<InputFieldProps> = (props): JSX.Element => {
  const { setIsGameStarted, setIsConnectionModalOpen } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = React.useState("");
  const [isSync, setIsSync] = React.useState(false);
  const [user, setUser] = React.useState<FirebaseUser | null>(null);

  useEffect(() => {
    if (isSync) return;

    const auth = getAuth();
    onAuthStateChanged(auth, (_user: FirebaseUser | null) => {
      if (_user) {
        setUser(_user);
        return;
      } else {
        setUser(null);
      }
      setIsSync(true);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
    } else {
      setUsername("");
    }
  }, [user]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = username;
    }
  }, [username]);

  const onGoClick = () => {
    if (!user) {
      setIsConnectionModalOpen(true);
      return;
    }
    setIsGameStarted(true);
    if (!username) return;
    if (username == user.displayName) return;

    updateProfile(user, {
      displayName: username,
    }).then(() => {
      console.log("Updated profile");
    });
  };

  return (
    <div>
      <SkinSelection />
      <div className="inputField-container">
        <form
          className="input-form"
          onSubmit={() => {
            inputRef.current?.blur();
          }}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Username 🤔"
          onChange={(e) => setUsername(e.target.value)}
          className="input-field-box"
        />
        <select id="gameMode" className="input-select">
          <option key="normal" value="normal" className="input-select-option">
            Normal
          </option>
          <option
            key="hardcore"
            value="hardcore"
            className="input-select-option"
          >
            Hardcore
          </option>
        </select>
        <button
          className="input-field-submit"
          type="submit"
          onClick={() => onGoClick()}
        >
          GO
        </button>
      </div>
    </div>
  );
};

export default InputField;
