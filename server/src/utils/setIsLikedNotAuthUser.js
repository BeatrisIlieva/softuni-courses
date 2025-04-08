exports.setJewelriesLikedNotAuthUser = async (jewelries, jewelryIds) => {
  for (let i = 0; i < jewelries.length; i++) {
    const jewelry = jewelries[i];
    let jewelryId = jewelry._id;
    let isLikedByUser = jewelryIds.includes(jewelryId);

    jewelry["isLikedByUser"] = isLikedByUser;
  }
  return jewelries;
};

exports.setJewelryLikedNotAuthUser = async (req, jewelry) => {
  const jewelryIds = Object.keys(req.session.wishlistItems || {}).map(Number);

  jewelryId = jewelry[0]._id;
  let isLikedByUser = jewelryIds.includes(jewelryId);

  firstObj = jewelry;
  secondObj = { isLikedByUser: isLikedByUser };

  jewelry = firstObj.map((obj) => ({ ...obj, ...secondObj }));

  return jewelry;
};
