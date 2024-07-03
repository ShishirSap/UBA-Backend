import { Request, Response, NextFunction } from 'express';
import { createUser, users } from '../controllers/users';
import schemaValidator from '../middlewares/schemaValidator';
import schemas from '../validator/schema';

describe('User CRUD Controller - createUser with validation', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        req = {
            method:'POST'
        };
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({
            json: mockJson,
        });

        res = {
            status: mockStatus,
            json: mockJson,
        } as Partial<Response>;

        next = jest.fn();

        users.length = 0; // Clear the users array before each test
    });

    it('should create a new user with valid data', async () => {
        req.body = { name: 'John Doe', email: 'john@example.com', password: 'Password123!' };

        const validator = schemaValidator('/auth/signup', true);
        await validator(req as Request, res as Response, next);

        if (!mockStatus.mock.calls.length) {
            createUser(req as Request, res as Response);
        }

        expect(next).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            id: expect.any(String),
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password123!',
        }));
        expect(users.length).toBe(1);
    });

    it('should not create a user with invalid email', async () => {
        req.body = { name: 'John Doe', email: 'john@example', password: 'Password123!' };

        const validator = schemaValidator('/auth/signup', true);
        await validator(req as Request, res as Response, next);

        expect(mockStatus).toHaveBeenCalledWith(422);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            status: 'failed',
            error: expect.objectContaining({
                details: expect.any(Array),
            }),
        }));
        expect(users.length).toBe(0);
    });

})