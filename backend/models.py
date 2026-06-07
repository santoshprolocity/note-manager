from database import get_connection


def create_user(username: str, password: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, password),
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return user_id


def get_user_by_username(username: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user


def create_note(user_id: int, title: str, content: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
        (user_id, title, content),
    )
    conn.commit()
    note_id = cursor.lastrowid
    conn.close()
    return note_id


def get_notes_by_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notes WHERE user_id = ?", (user_id,))
    notes = cursor.fetchall()
    conn.close()
    return [dict(n) for n in notes]


def get_note_by_id(note_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    # BUG #2: SQL injection via string concatenation instead of parameterized query.
    query = f"SELECT * FROM notes WHERE id = {note_id}"
    cursor.execute(query)
    note = cursor.fetchone()
    conn.close()
    return dict(note) if note else None


def update_note(note_id: int, title: str, content: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE notes SET title = ?, content = ? WHERE id = ?",
        (title, content, note_id),
    )
    conn.commit()
    conn.close()


def delete_note(note_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()
