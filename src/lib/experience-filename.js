module.exports = function (experience) {
  var name = experience.name
    .toLowerCase()
    .replace(/[^\w]/g, '-')
    .replace(/-+/g, '-')

  return name + '-' + experience.id
}
