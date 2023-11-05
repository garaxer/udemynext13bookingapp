import { ChangeEvent } from "react";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
};
type AuthModalInputsProps = {
  inputs: Inputs;
  isSignIn: boolean;
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
};
export default function AuthModalInputs({
  isSignIn,
  inputs,
  handleChangeInput,
}: AuthModalInputsProps) {
  return (
    <div>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="First Name"
            value={inputs.firstName}
            name={"firstName"}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Last Name"
            value={inputs.lastName}
            name={"lastName"}
            onChange={handleChangeInput}
          />
        </div>
      )}
       <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-full"
          placeholder="Email"
          value={inputs.email}
          name={"email"}
          onChange={handleChangeInput}
        />
      </div>
      {isSignIn ? null : (
        <div className="my-3 flex justify-between text-sm">
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="Phone"
            value={inputs.phone}
            name={"phone"}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-2 py-3 w-[49%]"
            placeholder="City"
            value={inputs.city}
            name={"city"}
            onChange={handleChangeInput}
          />
        </div>
      )}
      <div className="my-3 flex justify-between text-sm">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full"
          placeholder="Password"
          value={inputs.password}
          name={"password"}
          onChange={handleChangeInput}
        />
      </div>
    </div>
  );
}
