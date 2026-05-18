import { generateToken } from "../../utils/jwt";
import { brevoSend } from "../../utils/brevoSettings";
import db from "../../config/database.js";
export const magicLink = async (method, receiver, operatorId) => {
  try {
    const { email, number, username } = receiver;

    if (method != "whatsapp" && method != "email")
      return "Wrong Method Argument.";
    if (method == "email") {
      if (!email || typeof email != "string")
        return "Email (of type String) Needed.";
      else if (!username) return "Name of User Required...";
      //Because of the DB, we must pre-register the User to mark the progress.
      const register = await db.query(
        "INSERT INTO users(email, firstname, role) VALUES ($1, $2, $3)",
        [email, username, "contractor"],
      );
      if (register.rows.length == 1) {
        const session = await generateToken(receiver, "5h");

        const sending = await brevoSend({ session, receiver });

        if (sending) {
          //Let's Update the Flow
          const registerContractor = await db.query("INSERT INTO contractor_profiles (user_id, onboarding_status) VALUES($1, $2)", [register.rows[0].id, "INVITED"]);

          const onboardingSteps = await db.query("INSERT INTO onboarding_steps(contractor_profile_id, step_name, completed) VALUES ($1, $2, $3)", [registerContractor.rows[0].id, "personal_info", false]);

          const notifyTheStaff = await db.query("INSERT INTO notifications (user_id, title, message, type,) VALUES ($1, $2, $3, $4)", [operatorId, "Contractor Invited", "There's a New Contractor in the Onboarding Process", "email"])
         //onboarding_events right here i guess
         
         return {message: "Link Successfully Sent! Updating Platform System!";}

        } else return "The Email Failed, try again later please...";
      } else return "Something failed making pre-register... Try again later please!";
    } else if(method == "whatsapp"){
      //Whatsapp Logic Here... Evaluating Twillio over Meta API
    }
  } catch (error) {
    return error?.message;
  }
};
