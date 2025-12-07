# Codebase Improvement Plan

Based on the analysis of the codebase, here is a plan to address the identified issues. After each adjustment, the code will be verified to ensure that it works as expected.

## 1. Security & Dependencies

*   [x] **Update `promise-mysql` to `mysql2/promise`**: Replace the deprecated `promise-mysql` library with `mysql2/promise` to ensure security and performance improvements.
    *   [x] Verify that the application still works as expected.
*   [x] **Fix SQL Injection Vulnerability**: Replace raw SQL query construction with a query builder or an ORM to prevent SQL injection attacks. A good option would be `Knex.js`.
    *   [x] Verify that the application still works as expected.
*   [x] **Update Outdated Dependencies**: Update all outdated dependencies to their latest stable versions.
    *   [x] Verify that the application still works as expected.

## 2. Performance

*   [x] **Implement DataLoader**: Introduce `DataLoader` to solve the N+1 problem in the GraphQL resolvers. This will significantly improve the performance of queries for nested objects.
    *   [x] Verify that the application still works as expected.

## 3. Code Quality & Maintainability

*   [x] **Refactor Data Access Layer**: Abstract the duplicated logic in the data access layer (`source/common.ts`).
    *   [x] Verify that the application still works as expected.
*   [x] **Simplify Data Mapping**: Simplify the data mapping process to reduce complexity and improve maintainability.
    *   [x] Verify that the application still works as expected.