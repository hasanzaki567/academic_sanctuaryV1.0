import { Classroom, User } from '../types';

const USER_COOKIE_KEY = 'as_auth_user';
const CLASSROOM_COOKIE_KEY = 'as_active_classroom_id';
const CLASSROOM_OBJ_KEY = 'as_active_classroom_obj';
const NAV_VIEW_KEY = 'as_current_view';
const NAV_SUBJECT_KEY = 'as_selected_subject_id';

// Cookie helpers
function setCookie(name: string, value: string, days = 30) {
  try {
    const maxAge = days * 24 * 60 * 60;
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  } catch (e) {
    console.warn('Could not set cookie:', e);
  }
}

function getCookie(name: string): string | null {
  try {
    if (typeof document === 'undefined') return null;
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
  } catch (e) {
    console.warn('Could not read cookie:', e);
  }
  return null;
}

function deleteCookie(name: string) {
  try {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  } catch (e) {
    console.warn('Could not delete cookie:', e);
  }
}

/**
 * Persist authenticated user session in browser cookies (and synchronized localStorage)
 */
export function saveSessionUser(user: User, classroomId?: string | null) {
  try {
    const sanitizedUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
      classCode: user.classCode,
      registrationNumber: user.registrationNumber,
      classroomId: classroomId || user.classroomId,
    };

    const serialized = JSON.stringify(sanitizedUser);
    setCookie(USER_COOKIE_KEY, serialized, 30);
    if (sanitizedUser.classroomId) {
      setCookie(CLASSROOM_COOKIE_KEY, sanitizedUser.classroomId, 30);
    }

    // Mirror to localStorage for instant, synchronous hydration on refresh
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(USER_COOKIE_KEY, serialized);
      if (sanitizedUser.classroomId) {
        window.localStorage.setItem(CLASSROOM_COOKIE_KEY, sanitizedUser.classroomId);
      }
    }
  } catch (e) {
    console.warn('Error saving session user:', e);
  }
}

/**
 * Restore authenticated session on page refresh or component mount
 */
export function getSessionUser(): { user: User | null; classroomId: string | null } {
  try {
    // 1. Try reading from cookie first
    let rawUser = getCookie(USER_COOKIE_KEY);
    let classroomId = getCookie(CLASSROOM_COOKIE_KEY);

    // 2. Fallback to localStorage mirror
    if (!rawUser && typeof window !== 'undefined' && window.localStorage) {
      rawUser = window.localStorage.getItem(USER_COOKIE_KEY);
      if (!classroomId) {
        classroomId = window.localStorage.getItem(CLASSROOM_COOKIE_KEY);
      }
    }

    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed && parsed.id) {
        return {
          user: parsed as User,
          classroomId: classroomId || parsed.classroomId || null,
        };
      }
    }
  } catch (e) {
    console.warn('Error reading session user:', e);
  }
  return { user: null, classroomId: null };
}

/**
 * Update the active cohort classroom ID in session cookies
 */
export function updateSessionClassroomId(classroomId: string) {
  try {
    setCookie(CLASSROOM_COOKIE_KEY, classroomId, 30);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CLASSROOM_COOKIE_KEY, classroomId);
      const raw = window.localStorage.getItem(USER_COOKIE_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        u.classroomId = classroomId;
        window.localStorage.setItem(USER_COOKIE_KEY, JSON.stringify(u));
        setCookie(USER_COOKIE_KEY, JSON.stringify(u), 30);
      }
    }
  } catch (e) {
    console.warn('Error updating session classroom id:', e);
  }
}

/**
 * Persist and restore active classroom snapshot for instant refresh hydration
 */
export function saveSessionClassroom(classroom: Classroom | null) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (classroom) {
        window.localStorage.setItem(CLASSROOM_OBJ_KEY, JSON.stringify(classroom));
      } else {
        window.localStorage.removeItem(CLASSROOM_OBJ_KEY);
      }
    }
  } catch (e) {
    console.warn('Error saving session classroom:', e);
  }
}

export function getSessionClassroom(): Classroom | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(CLASSROOM_OBJ_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id) return parsed as Classroom;
      }
    }
  } catch (e) {
    console.warn('Error reading session classroom:', e);
  }
  return null;
}

/**
 * Persist and restore current active page & subject across page refreshes
 */
export function saveNavigationState(view: string, subjectId?: string | null) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(NAV_VIEW_KEY, view);
      if (subjectId) {
        window.localStorage.setItem(NAV_SUBJECT_KEY, subjectId);
      } else {
        window.localStorage.removeItem(NAV_SUBJECT_KEY);
      }
    }
  } catch (e) {
    console.warn('Error saving navigation state:', e);
  }
}

export function getNavigationState(): { view: string | null; subjectId: string | null } {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return {
        view: window.localStorage.getItem(NAV_VIEW_KEY),
        subjectId: window.localStorage.getItem(NAV_SUBJECT_KEY),
      };
    }
  } catch (e) {
    console.warn('Error reading navigation state:', e);
  }
  return { view: null, subjectId: null };
}

/**
 * Clear session cookies and localStorage upon signing out
 */
export function clearSessionUser() {
  try {
    deleteCookie(USER_COOKIE_KEY);
    deleteCookie(CLASSROOM_COOKIE_KEY);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(USER_COOKIE_KEY);
      window.localStorage.removeItem(CLASSROOM_COOKIE_KEY);
      window.localStorage.removeItem(CLASSROOM_OBJ_KEY);
      window.localStorage.removeItem(NAV_VIEW_KEY);
      window.localStorage.removeItem(NAV_SUBJECT_KEY);
      window.localStorage.removeItem('as_notes_subject_id');
    }
  } catch (e) {
    console.warn('Error clearing session user:', e);
  }
}
