export type AuthError =
  | typeof WrongPassword
  | typeof SomethingWrong
  | typeof UserNotFound;

export const WrongPassword = "Incorrect email/password";
export const UserNotFound = "User not found... Please sign up";
export const SomethingWrong = "Something went wrong... Please try again";
