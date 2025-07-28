const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Todo = require("../models/Todo");

// @route   GET api/todos
// @desc    Giriş yapmış kullanıcının arşivlenmemiş görevlerini getir
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id, archived: false }).sort({
      position: 1,
    });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// @route   POST api/todos
// @desc    Yeni bir görev ekle
router.post("/", auth, async (req, res) => {
  try {
    const { task, dueDate } = req.body;
    if (!task) {
      return res.status(400).json({ msg: "Lütfen görev alanını doldurun" });
    }
    const taskCount = await Todo.countDocuments({
      user: req.user.id,
      archived: false,
    });

    const newTodo = new Todo({
      user: req.user.id,
      task,
      dueDate,
      position: taskCount,
    });
    const todo = await newTodo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// @route   PATCH api/todos/reorder
// @desc    Kullanıcının görevlerini yeniden sırala
router.patch("/reorder", auth, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ msg: "Geçersiz veri formatı" });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, user: req.user.id },
        update: { $set: { position: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await Todo.bulkWrite(bulkOps);
    }

    res.json({ msg: "Görevler başarıyla yeniden sıralandı" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// @route   GET api/todos/completed
router.get("/completed", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id, completed: true }).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// @route   GET api/todos/weekly
router.get("/weekly", auth, async (req, res) => {
  try {
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const dayOfWeek = targetDate.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const todos = await Todo.find({
      user: req.user.id,
      dueDate: { $gte: startOfWeek, $lte: endOfWeek },
      archived: false,
    }).sort({ position: 1 });

    const daysOfWeek = [
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ];
    const groupedByDay = daysOfWeek.reduce(
      (acc, day) => ({ ...acc, [day]: [] }),
      {}
    );

    todos.forEach((todo) => {
      let dayIndex = new Date(todo.dueDate).getDay();
      dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      const dayName = daysOfWeek[dayIndex];
      if (groupedByDay[dayName]) {
        groupedByDay[dayName].push(todo);
      }
    });

    res.json({
      weekData: groupedByDay,
      weekRange: { start: startOfWeek, end: endOfWeek },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// @route   PATCH api/todos/:id
// @desc    Bir görevi güncelle
router.patch("/:id", auth, async (req, res) => {
  try {
    // GÜNCELLEME: 'description' alanı req.body'den alındı.
    const { task, dueDate, description } = req.body;
    let todoToUpdate = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!todoToUpdate) {
      return res
        .status(404)
        .json({ msg: "Görev bulunamadı veya yetkiniz yok" });
    }
    if (task && task.trim() !== "") todoToUpdate.task = task;
    if (dueDate !== undefined) todoToUpdate.dueDate = dueDate;

    // GÜNCELLEME: description alanı varsa, veritabanındaki göreve ata.
    if (description !== undefined) {
      todoToUpdate.description = description;
    }

    const updatedTodo = await todoToUpdate.save();
    res.json(updatedTodo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// @route   PUT api/todos/:id
// @desc    Bir görevin tamamlanma durumunu değiştir
router.put("/:id", auth, async (req, res) => {
  try {
    let todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res
        .status(404)
        .json({ msg: "Görev bulunamadı veya yetkiniz yok" });
    }
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

// @route   DELETE api/todos/:id
// @desc    Bir görevi arşivle
router.delete("/:id", auth, async (req, res) => {
  try {
    let todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res
        .status(404)
        .json({ msg: "Görev bulunamadı veya yetkiniz yok" });
    }
    todo.archived = true;
    await todo.save();
    res.json({ msg: "Görev başarıyla arşivlendi" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sunucu Hatası");
  }
});

module.exports = router;
