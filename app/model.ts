export interface IAuthProps {
  token: string;
  role: "admin" | "student" | "classRep" | "";
}
