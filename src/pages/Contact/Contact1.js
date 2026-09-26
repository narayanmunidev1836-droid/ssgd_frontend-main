// import React, { useState } from "react";
// import "react-phone-number-input/style.css";
// import PhoneInput from "react-phone-number-input";
// import { isValidPhoneNumber } from "libphonenumber-js";

// const Contact1 = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isValidPhone, setIsValidPhone] = useState(false);
//   const [touched, setTouched] = useState(false);

//   const onValueChange = (value) => {
//     const stringValue = String(value);
//     setPhoneNumber(stringValue);
//     setIsValidPhone(isValidPhoneNumber(value));
//     // setTouched(true);
//   };

//   const submitForm = () => {
//     console.log("phone number is: ", phoneNumber);
//   };

//   return (
//     <div className="container">
//       <PhoneInput
//         international
//         defaultCountry="CY"
//         value={phoneNumber}
//         onChange={onValueChange}
//         placeholder="Enter phone number"
//       />
//       {phoneNumber && (
//         <p className={`info ${isValidPhone ? "valid" : "error"}`}>
//           {isValidPhone
//             ? "Well done, you entered a valid phone number"
//             : "Please enter a valid phone number"}
//         </p>
//       )}
//       <button
//         style={{ marginTop: 10 }}
//         disabled={!isValidPhone}
//         onClick={submitForm}
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default Contact1;

//react
import React, { useState } from "react";
//react dom
// import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
//react phone input 2
// import PhoneInput from "https://cdn.skypack.dev/react-phone-input-2@2.15.1";

// import { isValidPhoneNumber } from "https://cdn.skypack.dev/-/libphonenumber-js@v1.10.44-FkINdIGog9Gh1RJAKulV/dist=es2019,mode=imports/optimized/libphonenumber-js.js";

import PhoneInput from "react-phone-input-2";
import { isValidPhoneNumber } from "libphonenumber-js";

const Contact1 = () => {
  const [phoneNumber, setPhoneNumber] = useState(""),
    [isValidPhone, setIsValidPhone] = useState(false),
    [touched, setTouched] = useState(false);

  const onValueChange = (value, data) => {
    setPhoneNumber(value);
    setIsValidPhone(isValidPhoneNumber(`+${value}`, data.countryCode));
    setTouched(true);
  };

  const submitForm = () => {
      };

  return (
    <div className="container">
      <PhoneInput
        prefix="+"
        enableSearch
        disableSearchIcon
        countryCodeEditable={false}
        country={"cy"}
        inputProps={{
          name: "phone-number",
        }}
        onChange={(value, data) => onValueChange(value, data)}
        placeholder="Phone number"
        searchPlaceholder="Search"
        searchNotFound="No results found"
        value={phoneNumber}
        isValid={(value, country) =>
          touched ? isValidPhoneNumber(`+${value}`, country.iso2) : true
        }
      />
      {phoneNumber && (
        <p className={`info ${isValidPhone ? "valid" : "error"}`}>
          {isValidPhone
            ? "Well done, you entered a valid phone number"
            : "Please enter a valid phone number"}
        </p>
      )}
      <button
        style={{ marginTop: 10 }}
        disabled={!isValidPhone}
        onClick={submitForm}
      >
        Submit
      </button>
    </div>
  );
};

export default Contact1;
