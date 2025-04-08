const ShoppingBag = require("../models/ShoppingBag");
const Inventory = require("../models/Inventory");
const { DEFAULT_MIN_QUANTITY } = require("../constants/shoppingBag");
const User = require("../models/User");

exports.getOne = async ({ userId, jewelryId, sizeId }) => {
  const bagItem = await ShoppingBag.findOne({
    user: userId,
    jewelry: jewelryId,
    size: sizeId,
  });

  return bagItem;
};

exports.getAll = async (user) => {
  let matchCondition;

  if (!isNaN(Number(user))) {
    const userById = await User.findById(user);

    matchCondition = [
      {
        $match: {
          userID: userById._id,
        },
      },
    ];
  } else {
    matchCondition = [
      {
        $match: {
          userUUID: user,
        },
      },
    ];
  }

  let jewelries = await ShoppingBag.aggregate([
    ...matchCondition,
    {
      $lookup: {
        as: "jewelries",
        from: "jewelries",
        foreignField: "_id",
        localField: "jewelry",
      },
    },
    {
      $unwind: "$jewelries",
    },
    {
      $lookup: {
        as: "jewelrymetals",
        from: "jewelrymetals",
        foreignField: "jewelry",
        localField: "jewelries._id",
      },
    },
    {
      $unwind: "$jewelrymetals",
    },
    {
      $lookup: {
        as: "metals",
        from: "metals",
        foreignField: "_id",
        localField: "jewelrymetals.metal",
      },
    },
    {
      $unwind: "$metals",
    },
    {
      $lookup: {
        as: "jewelrystones",
        from: "jewelrystones",
        foreignField: "jewelry",
        localField: "jewelries._id",
      },
    },
    {
      $unwind: "$jewelrystones",
    },
    {
      $lookup: {
        as: "stonetypes",
        from: "stonetypes",
        foreignField: "_id",
        localField: "jewelrystones.stoneType",
      },
    },
    {
      $unwind: "$stonetypes",
    },
    {
      $lookup: {
        as: "stonecolors",
        from: "stonecolors",
        foreignField: "_id",
        localField: "jewelrystones.stoneColor",
      },
    },
    {
      $unwind: "$stonecolors",
    },
    {
      $lookup: {
        as: "categories",
        from: "categories",
        foreignField: "_id",
        localField: "jewelries.category",
      },
    },
    {
      $lookup: {
        as: "inventories",
        from: "inventories",
        foreignField: "jewelry",
        localField: "jewelry",
      },
    },
    {
      $lookup: {
        as: "sizes",
        from: "sizes",
        foreignField: "_id",
        localField: "size",
      },
    },
    {
      $unwind: "$inventories",
    },
    {
      $unwind: "$sizes",
    },
    {
      $unwind: "$categories",
    },
    {
      $addFields: {
        totalPrice: {
          $multiply: ["$inventories.price", "$quantity"],
        },
        minQuantity: 0,
        maxQuantity: {
          $sum: ["$inventories.quantity", "$quantity"],
        },
      },
    },
    {
      $addFields: {
        metalInfo: {
          $map: {
            input: [
              {
                metal: "$metals",
                caratWeight: "$jewelrymetals.caratWeight",
              },
            ],
            as: "jm",
            in: {
              metal: "$$jm.metal.title",
              caratWeight: "$$jm.caratWeight",
              metalId: "$$jm.metal._id",
            },
          },
        },
      },
    },
    {
      $addFields: {
        stoneInfo: {
          $map: {
            input: [
              {
                stoneType: "$stonetypes",
                stoneColor: "$stonecolors",
                caratWeight: "$jewelrystones.caratWeight",
              },
            ],
            as: "js",
            in: {
              stoneType: "$$js.stoneType.title",
              stoneColor: "$$js.stoneColor.title",
              caratWeight: "$$js.caratWeight",
              stoneTypeId: "$$js.stoneType._id",
            },
          },
        },
      },
    },
    {
      $addFields: {
        jewelryId: "$jewelries._id",
      },
    },
    {
      $addFields: {
        sizeId: "$sizes._id",
      },
    },
    {
      $group: {
        _id: "$_id",
        jewelryId: {
          $first: "$jewelryId",
        },
        user: {
          $first: "$user",
        },
        jewelryTitle: {
          $first: "$jewelries.title",
        },
        firstImageUrl: {
          $first: "$jewelries.firstImageUrl",
        },
        categoryTitle: {
          $first: "$categories.title",
        },
        size: {
          $first: "$sizes.measurement",
        },
        sizeTitle: {
          $first: "$sizes.title",
        },
        sizeId: {
          $first: "$sizeId",
        },
        metalInfo: {
          $push: "$metalInfo",
        },
        stoneInfo: {
          $push: "$stoneInfo",
        },
        quantity: {
          $first: "$quantity",
        },
        maxQuantity: {
          $first: "$maxQuantity",
        },
        minQuantity: {
          $first: "$minQuantity",
        },
        totalPrice: {
          $first: "$totalPrice",
        },
        createdAt: {
          $first: "$createdAt",
        },
      },
    },
    {
      $sort: {
        "metalInfo.metalId": 1,
      },
    },
    {
      $sort: {
        "stoneInfo.stoneTypeId": 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        user: 1,
        jewelryId: 1,
        jewelryTitle: 1,
        categoryTitle: 1,
        title: 1,
        firstImageUrl: 1,
        size: 1,
        sizeId: 1,
        sizeTitle: 1,
        metalInfo: { $setUnion: "$metalInfo" },
        stoneInfo: { $setUnion: "$stoneInfo" },
        quantity: 1,
        maxQuantity: 1,
        minQuantity: 1,
        totalPrice: 1,
        metalId: 1,
        stoneTypeId: 1,
      },
    },
    {
      $group: {
        _id: null,
        documents: {
          $push: "$$ROOT",
        },
        totalTotalPrice: {
          $sum: "$totalPrice",
        },
        totalQuantity: {
          $sum: "$quantity",
        },
      },
    },
    {
      $project: {
        documents: 1,
        totalTotalPrice: 1,
        totalQuantity: 1,
      },
    },
  ]);
  console.log("jewelries");
  return jewelries;
};

exports.create = async ({
  userId,
  userUUID,
  jewelryId,
  sizeId,
  quantity: DEFAULT_ADD_QUANTITY,
}) => {
  bagItem = await ShoppingBag.create({
    userID: userId,
    userUUID: userUUID,
    jewelry: jewelryId,
    size: sizeId,
    quantity: DEFAULT_ADD_QUANTITY,
  });

  await Inventory.findOneAndUpdate(
    { jewelry: jewelryId, size: sizeId },
    { $inc: { quantity: -1 } },
    { new: true }
  );
};

exports.decrease = async (bagId) => {
  // let bagItem = await ShoppingBag.findByIdAndUpdate(
  //   bagId,
  //   { $inc: { quantity: -1 } }, // Decrease quantity by 1
  //   { new: true } // Return the modified document
  // );

  // if (bagItem.quantity === 0) {
  //   await ShoppingBag.findByIdAndDelete(bagId);
  // }

  let bagItem = await ShoppingBag.findById(bagId);

  const jewelryId = Number(bagItem.jewelry);

  const sizeId = Number(bagItem.size);

  const bagQuantity = bagItem.quantity;

  const newBagQuantity = bagQuantity - 1;

  await ShoppingBag.findByIdAndUpdate(bagId, { quantity: newBagQuantity });

  bagItem = await ShoppingBag.findById(bagId);

  if (bagItem.quantity === 0) {
    await ShoppingBag.findByIdAndDelete(bagId);
  }

  const inventoryItem = await Inventory.findOne({
    jewelry: jewelryId,
    size: sizeId,
  });

  const inventoryQuantity = inventoryItem.quantity || 0;
  const newInventoryQuantity = inventoryQuantity + 1;
  await Inventory.findOneAndUpdate(
    { jewelry: jewelryId, size: sizeId },
    { quantity: newInventoryQuantity },
    { new: true }
  );
};

exports.increase = async (bagId) => {
  let bagItem = await ShoppingBag.findById(bagId);

  const jewelryId = Number(bagItem.jewelry);

  const sizeId = Number(bagItem.size);

  const bagQuantity = bagItem.quantity;

  const newBagQuantity = bagQuantity + 1;

  await ShoppingBag.findByIdAndUpdate(bagId, { quantity: newBagQuantity });

  bagItem = await ShoppingBag.findById(bagId);

  const inventoryItem = await Inventory.findOne({
    jewelry: jewelryId,
    size: sizeId,
  });

  const inventoryQuantity = inventoryItem.quantity || 0;
  const newInventoryQuantity = inventoryQuantity - 1;
  await Inventory.findOneAndUpdate(
    { jewelry: jewelryId, size: sizeId },
    { quantity: newInventoryQuantity },
    { new: true }
  );
};

exports.update = async (bagItemId, updatedQuantity) => {
  const bagItem = await ShoppingBag.findById(bagItemId);

  const sizeId = Number(bagItem.size);

  const alreadyAddedQuantity = bagItem.quantity;

  const jewelryId = Number(bagItem.jewelry);

  const inventoryItem = await Inventory.findOne({
    jewelry: jewelryId,
    size: sizeId,
  });

  const quantity = inventoryItem.quantity || 0;

  const availableQuantity = quantity + alreadyAddedQuantity;

  if (updatedQuantity < DEFAULT_MIN_QUANTITY) {
    throw new Error("Quantity must be greater than zero");
  } else if (updatedQuantity > availableQuantity) {
    throw new Error(
      `Please choose quantity between ${DEFAULT_MIN_QUANTITY} and ${availableQuantity}`
    );
  } else {
    await bagItem.updateOne({ quantity: updatedQuantity });

    let newQuantity;

    if (alreadyAddedQuantity < updatedQuantity) {
      difference = updatedQuantity - alreadyAddedQuantity;
      newQuantity = quantity - difference;
    } else {
      difference = alreadyAddedQuantity - updatedQuantity;
      newQuantity = quantity + difference;
    }

    await Inventory.findOneAndUpdate(
      { jewelry: jewelryId, size: sizeId },
      { quantity: newQuantity },
      { new: true }
    );

    if (Number(updatedQuantity) === 0) {
      await bagItem.deleteOne();
    }
  }
};

exports.delete = async (bagItemId) => {
  const bagItem = await ShoppingBag.findById(bagItemId);

  const sizeId = Number(bagItem.size);

  const alreadyAddedQuantity = bagItem.quantity;

  const jewelryId = Number(bagItem.jewelry);

  const inventoryItem = await Inventory.findOne({
    jewelry: jewelryId,
    size: sizeId,
  });

  const quantity = inventoryItem.quantity || 0;

  const availableQuantity = quantity + alreadyAddedQuantity;

  await Inventory.findOneAndUpdate(
    { jewelry: jewelryId, size: sizeId },
    { quantity: availableQuantity },
    { new: true }
  );

  await bagItem.deleteOne();
};
