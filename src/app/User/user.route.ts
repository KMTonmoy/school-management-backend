import express, { Request, Response, NextFunction } from 'express';
import { userControllers } from './user.controller';
import jwt from 'jsonwebtoken';
import { UserModel } from './user.model';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'admin' | 'teacher' | 'student';
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (roles: ('admin' | 'teacher' | 'student')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/auth/register/admin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await userControllers.createAdmin(req.body);
    res.status(201).json(admin);
  } catch (err) {
    next(err);
  }
});

router.post('/auth/register/teacher', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacher = await userControllers.createTeacher(req.body);
    res.status(201).json(teacher);
  } catch (err) {
    next(err);
  }
});

router.post('/auth/register/student', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await userControllers.createStudent(req.body);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userControllers.loginUser(req.body.email, req.body.password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/admin/users', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userControllers.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/users/:id/block', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userControllers.blockUser(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/admin/users/:id/unblock', authenticate, authorize(['admin']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userControllers.unblockUser(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/teachers', authenticate, authorize(['admin', 'teacher']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teachers = await userControllers.getTeachers();
    res.status(200).json(teachers);
  } catch (err) {
    next(err);
  }
});

router.get('/students', authenticate, authorize(['admin', 'teacher']), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await userControllers.getStudents();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});

router.patch('/users/password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const result = await userControllers.updatePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export const UserRoutes = router;