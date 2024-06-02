namespace swp391_be.API.Models.Enum
{
    public class EmailMessage
    {
        public const string CONFIRM = "Your Confirmation Email Code";
        public const string CHANGE = "Your Change Confirmation Email Code";
        public const string FORGET = "Your Forget Password Confirmation Code";
    }

    public class ConfirmAction
    {
        public const string CONFIRM = "Confirm";
        public const string CHANGE = "Change";
        public const string FORGET = "Forget";
    }
}
