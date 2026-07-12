import { authClient } from "./src/lib/auth-client";
export async function test() {
  const result = await authClient.signIn.email({ email: "test", password: "test" });
  console.log(result);
}
