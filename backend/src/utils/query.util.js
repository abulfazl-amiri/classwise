/**
 * Adds common API query behavior to a Mongoose query.
 *
 * Supported query params:
 * - filtering: any model field, plus comparison operators lt/lte/gt/gte
 * - sort: comma-separated fields, e.g. sort=-createdAt,name
 * - fields: comma-separated selected fields, e.g. fields=name,level
 * - page/limit: pagination controls
 *
 * Methods are chainable and mutate `this.mongooseQuery`.
 */
class QueryBuilder {
  /**
   * @param {mongoose.Query} mongooseQuery - Mongoose query object (Model.find())
   * @param {object} queryString - URL params (req.query)
   */
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString ?? {};
  }

  filter() {
    const baseFilter = this.mongooseQuery.getFilter?.() ?? {};

    // taking out and throw away: page, limit, fields, sort (we do not use them here)
    let { page, limit, fields, sort, ...queryObj } = this.queryString;
    let operators = ["lt", "lte", "gte", "gt"];

    // Convert comparison operators to MongoDB syntax: e.g. { gte: '100' } -> { $gte: '100' }
    for (let [key, val] of Object.entries(queryObj)) {
      if (typeof val !== "object" || val === null) continue;

      queryObj[key] = Object.entries(val).reduce((acc, entry) => {
        const [k, v] = entry;
        if (!operators.includes(k) || v === undefined) return acc;
        acc[`$${k}`] = v;
        return acc;
      }, {});
    }

    this.mongooseQuery = this.mongooseQuery.find({ ...queryObj, ...baseFilter });
    return this;
  }
  sort() {
    let sort = this.queryString.sort;
    if (typeof sort !== "string" || !sort.trim()) sort = "-createdAt";
    sort = sort.split(",").join(" ");
    this.mongooseQuery = this.mongooseQuery.sort(sort);
    return this;
  }
  select() {
    let fields = this.queryString.fields;
    if (typeof fields !== "string" || !fields.trim()) fields = "-createdAt -updatedAt -__v";
    fields = fields.split(",").join(" ");
    this.mongooseQuery = this.mongooseQuery.select(fields);
    return this;
  }
  paginate() {
    let [limit, page] = [this.queryString.limit, this.queryString.page];
    limit = Number(limit);
    if (!Number.isFinite(limit)) limit = 10;
    limit = Math.min(Math.max(Math.trunc(limit), 1), 100);
    this.mongooseQuery = this.mongooseQuery.limit(limit);
    page = Number(page);
    if (!Number.isFinite(page)) page = 1;
    page = Math.max(Math.trunc(page), 1);
    this.mongooseQuery = this.mongooseQuery.skip(limit * (page - 1));
    return this;
  }
  async execute() {
    return await this.mongooseQuery;
  }
}

export default QueryBuilder;
