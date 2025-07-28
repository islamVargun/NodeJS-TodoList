const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth"); // auth middleware'i import edildi

// @route   GET api/auth/user
// @desc    Giriş yapmış kullanıcıyı getir
// @access  Private
// YENİ: Bu rota, token'ı kullanarak kullanıcı bilgilerini getirir.
router.get("/user", auth, async (req, res) => {
  try {
    // req.user, auth middleware'i tarafından token'dan çözülen kullanıcıyı içerir.
    // .select('-password') ile şifrenin geri gönderilmesini engelliyoruz.
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "Kullanıcı bulunamadı" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Sunucu Hatası" });
  }
});

// @route   POST api/auth/login
// @desc    Kullanıcıyı doğrula & token al
// @access  Public
router.post(
  "/login",
  [
    check("email", "Lütfen geçerli bir e-posta adresi girin").isEmail(),
    check("password", "Şifre alanı zorunludur").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Geçersiz kimlik bilgileri" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Sunucu hatası" });
    }
  }
);

// @route   POST api/auth/register
// @desc    Kullanıcı kaydı yap
// @access  Public
router.post(
  "/register",
  [
    check("name", "İsim alanı zorunludur").not().isEmpty(),
    check("email", "Lütfen geçerli bir e-posta adresi girin").isEmail(),
    check(
      "password",
      "Lütfen 6 veya daha fazla karakterli bir şifre girin"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "Bu kullanıcı zaten mevcut" });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Sunucu hatası" });
    }
  }
);

module.exports = router;
