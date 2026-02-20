const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogInController = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    isLoggedIn: false,
    errorMessage: [],
    oldInput: {},
  });
};

exports.postLogInController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errorMessage: ["Invaild email"],
      oldInput: { email },
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      isLoggedIn: false,
      errorMessage: ["Invaild Password"],
      oldInput: { email },
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
  };

  req.session.save((err) => {
    if (err) {
      console.log("Session Save Error:", err);
    }
    console.log("Session saved successfully");
    res.redirect("/store/");
  });
};

exports.postLogOutController = (req, res, next) => {
  // res.cookie("isLoggedIn", false);
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getSignUpController = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    isLoggedIn: false,
    errorMessage: null,
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
    },
  });
};

exports.postSignUpController = [
  check("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Only Letters are allowed"),

  check("lastName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Last name must contain at least 3 Characters")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Only Letters are allowed"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["host", "guest"])
    .withMessage("User type must be either 'host' or 'guest'"),

  check("terms")
    .equals("on")
    .withMessage("You must accept the terms and conditions"),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req); // validationResult will give us the result of all the validation checks we have done above
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Sign Up",
        isLoggedIn: false,
        errorMessage: errors.array().map((err) => err.msg), // we are sending the first error message to the view
        oldInput: { firstName, lastName, email, userType }, // we are sending the old input data to the view so that we can pre-fill the form with the old data
      });
    }

    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          isLoggedIn: false,
          errorMessage: [err.message],
          oldInput: { firstName, lastName, email, userType },
        });
      });
  },
];
