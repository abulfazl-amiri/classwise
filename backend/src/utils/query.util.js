/**
 * Adds common API query behavior to a Mongoose query.
 *
 * Supported query params:
 * - filtering: any model field, plus comparison operators lt/lte/gt/gte
 * - sort: comma-separated fields, e.g. sort=-createdAt,name
 * - fields: comma-separated selected fields, e.g. fields=name,level
 * - page/limit: pagination controls
 *
 * Methods are chainable and mutate `this.query`.
 */
class APIFeatures {
  /**
   * @param {mongoose.Query} query - Mongoose query object e.g. Resource.find()
   * @param {object} queryString - Parsed URL params i.e. req.query
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // taking out and throw away: page, limit, fields, sort (we do not use them here)
    let { page, limit, fields, sort, ...queryObj } = this.queryString;
    let operators = ["lt", "lte", "gte", "gt"];

    // Convert comparison operators to MongoDB syntax: e.g. { gte: '100' } -> { $gte: '100' }
    for (let [key, val] of Object.entries(queryObj)) {
      if (typeof val !== "object") continue;

      queryObj[key] = Object.entries(val).reduce((acc, entry) => {
        const [k, v] = entry;
        if (!operators.includes(k) || v === undefined) return acc;
        acc[`$${k}`] = v;
        return acc;
      }, {});
    }

    this.query = this.query.find(queryObj);
    return this;
  }
  sort() {
    let sort = this.queryString.sort;
    if (!sort) sort = "-createdAt";
    sort = sort.split(",").join(" ");
    this.query = this.query.sort(sort);
    return this;
  }
  select() {
    let fields = this.queryString.fields;
    if (!fields) fields = "-createdAt -updatedAt -__v";
    fields = fields.split(",").join(" ");
    this.query = this.query.select(fields);
    return this;
  }
  paginate() {
    let [limit, page] = [this.queryString.limit, this.queryString.page];
    if (!limit) limit = 10;
    limit = Number(limit);
    this.query = this.query.limit(limit);
    if (!page) page = 1;
    page = Number(page);
    this.query = this.query.skip(limit * (page - 1));
    return this;
  }
}

export default APIFeatures;
