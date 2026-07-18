import{j as e}from"./index-BgjPHsDm.js";import{a as p}from"./i18n-BP_6ddag.js";import{c as f,o as Ee}from"./imageOptimizer-B1gZvlC5.js";import"./vendor-DutPk6Su.js";const _e=`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --bg: #0a0a0a;
            --bg-card: #131313;
            --bg-elevated: #1a1a1a;
            --bg-input: #111111;
            --white: #ffffff;
            --gray-100: #f0f0f0;
            --gray-200: #cccccc;
            --gray-300: #999999;
            --gray-400: #666666;
            --gray-500: #444444;
            --gray-600: #2a2a2a;
            --accent: #c8a96e;
            --accent-light: #e2c98a;
            --accent-dark: #a8893e;
            --danger: #ef4444;
            --danger-bg: rgba(239, 68, 68, 0.1);
            --success: #22c55e;
            --success-bg: rgba(34, 197, 94, 0.1);
            --info: #3b82f6;
            --info-bg: rgba(59, 130, 246, 0.1);
            --border: rgba(255,255,255,0.07);
            --border-accent: rgba(200,169,110,0.3);
            --sidebar-w: 260px;
            --radius: 12px;
            --radius-sm: 8px;
            --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        html { scroll-behavior: smooth; }

        .admin-body {
            background: var(--bg);
            color: var(--white);
            font-family: 'Tajawal', sans-serif;
            line-height: 1.6;
            min-height: 100vh;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--gray-600); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

        /* ===== LOGIN SCREEN ===== */
        .login-screen {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: var(--bg);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.4s ease;
        }

        .login-screen.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .login-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 48px 40px;
            width: 90%;
            max-width: 400px;
            text-align: center;
        }

        .login-logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: contain;
            background: var(--white);
            margin: 0 auto 24px;
            display: block;
            border: 2px solid var(--border);
        }

        .login-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            margin-bottom: 8px;
        }

        .login-sub {
            color: var(--gray-300);
            font-size: 0.85rem;
            margin-bottom: 28px;
        }

        .login-input {
            width: 100%;
            padding: 14px 18px;
            background: var(--bg-input);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            color: var(--white);
            font-family: 'Tajawal', sans-serif;
            font-size: 1rem;
            text-align: center;
            outline: none;
            margin-bottom: 16px;
            transition: border-color var(--transition);
            letter-spacing: 8px;
        }

        .login-input:focus { border-color: var(--accent); }
        .login-input::placeholder { letter-spacing: 2px; color: var(--gray-400); }

        .login-btn {
            width: 100%;
            padding: 14px;
            background: var(--white);
            color: var(--bg);
            border: none;
            border-radius: var(--radius-sm);
            font-family: 'Tajawal', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition);
        }

        .login-btn:hover { background: var(--gray-100); transform: translateY(-1px); }

        .login-error {
            color: var(--danger);
            font-size: 0.82rem;
            margin-top: 12px;
            display: none;
        }

        /* ===== LAYOUT ===== */
        .admin-layout {
            display: flex;
            min-height: 100vh;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
            width: var(--sidebar-w);
            background: var(--bg-card);
            border-left: 1px solid var(--border);
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            z-index: 50;
            transition: transform var(--transition);
        }

        .sidebar-header {
            padding: 24px 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-logo {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: contain;
            background: var(--white);
        }

        .sidebar-brand {
            display: flex;
            flex-direction: column;
        }

        .sidebar-brand-name {
            font-family: 'Playfair Display', serif;
            font-size: 0.95rem;
            font-weight: 800;
            color: var(--white);
        }

        .sidebar-brand-sub {
            font-size: 0.68rem;
            color: var(--accent);
            letter-spacing: 2px;
        }

        .sidebar-nav {
            flex: 1;
            padding: 16px 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            overflow-y: auto;
        }

        .sidebar-section-label {
            font-size: 0.65rem;
            color: var(--gray-400);
            letter-spacing: 3px;
            text-transform: uppercase;
            padding: 16px 12px 6px;
            font-weight: 700;
        }

        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 14px;
            border-radius: var(--radius-sm);
            color: var(--gray-300);
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 500;
            transition: var(--transition);
            cursor: pointer;
            border: none;
            background: none;
            width: 100%;
            text-align: right;
            font-family: 'Tajawal', sans-serif;
        }

        .sidebar-link:hover {
            background: rgba(255,255,255,0.04);
            color: var(--white);
        }

        .sidebar-link.active {
            background: rgba(200,169,110,0.1);
            color: var(--accent);
        }

        .sidebar-link i {
            width: 20px;
            text-align: center;
            font-size: 0.9rem;
        }

        .sidebar-footer {
            padding: 16px 20px;
            border-top: 1px solid var(--border);
        }

        .sidebar-back-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--gray-400);
            text-decoration: none;
            font-size: 0.82rem;
            transition: var(--transition);
        }

        .sidebar-back-link:hover { color: var(--accent); }

        /* ===== MAIN CONTENT ===== */
        .main-content {
            flex: 1;
            margin-right: var(--sidebar-w);
            padding: 32px 40px;
            min-height: 100vh;
        }

        .page-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .page-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem;
            font-weight: 800;
        }

        .page-subtitle {
            font-size: 0.85rem;
            color: var(--gray-300);
            margin-top: 4px;
        }

        /* ===== PANELS ===== */
        .panel {
            display: none;
        }

        .panel.active {
            display: block;
        }

        /* ===== CARDS ===== */
        .card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 28px;
            margin-bottom: 20px;
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .card-title {
            font-size: 1rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .card-title i {
            color: var(--accent);
        }

        /* ===== BUTTONS ===== */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: none;
            border-radius: var(--radius-sm);
            font-family: 'Tajawal', sans-serif;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition);
            text-decoration: none;
        }

        .btn-primary {
            background: var(--white);
            color: var(--bg);
        }

        .btn-primary:hover { background: var(--gray-100); transform: translateY(-1px); }

        .btn-accent {
            background: var(--accent);
            color: var(--bg);
        }

        .btn-accent:hover { background: var(--accent-light); transform: translateY(-1px); }

        .btn-outline {
            background: none;
            border: 1px solid var(--border);
            color: var(--gray-200);
        }

        .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

        .btn-danger {
            background: var(--danger-bg);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .btn-danger:hover { background: rgba(239, 68, 68, 0.2); }

        .btn-sm { padding: 7px 14px; font-size: 0.78rem; }
        .btn-icon { width: 36px; height: 36px; padding: 0; justify-content: center; }

        /* ===== FORM ELEMENTS ===== */
        .form-group {
            margin-bottom: 18px;
        }

        .form-label {
            display: block;
            font-size: 0.78rem;
            color: var(--gray-300);
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            background: var(--bg-input);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            color: var(--white);
            font-family: 'Tajawal', sans-serif;
            font-size: 0.9rem;
            outline: none;
            transition: border-color var(--transition);
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
            border-color: var(--accent);
        }

        .form-textarea {
            resize: vertical;
            min-height: 80px;
        }

        .form-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: left 12px center;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .form-row-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
        }

        .form-hint {
            font-size: 0.72rem;
            color: var(--gray-400);
            margin-top: 6px;
        }

        /* Color picker wrapper */
        .color-picker-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .color-picker-input {
            width: 44px;
            height: 44px;
            border: 2px solid var(--border);
            border-radius: var(--radius-sm);
            cursor: pointer;
            background: none;
            padding: 2px;
        }

        .color-picker-input::-webkit-color-swatch-wrapper { padding: 0; }
        .color-picker-input::-webkit-color-swatch { border: none; border-radius: 4px; }

        .opacity-slider {
            flex: 1;
            -webkit-appearance: none;
            height: 6px;
            border-radius: 3px;
            background: linear-gradient(to left, var(--accent), transparent);
            outline: none;
        }

        .opacity-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--white);
            cursor: pointer;
            border: 2px solid var(--accent);
        }

        /* ===== IMAGE UPLOAD ===== */
        .image-upload-zone {
            border: 2px dashed var(--border);
            border-radius: var(--radius);
            padding: 32px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
            color: var(--gray-400);
        }

        .image-upload-zone:hover {
            border-color: var(--accent);
            background: rgba(200,169,110,0.04);
            color: var(--accent);
        }

        .image-upload-zone i {
            font-size: 2rem;
            display: block;
            margin-bottom: 8px;
        }

        .image-upload-zone span {
            font-size: 0.85rem;
        }

        .images-preview {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 12px;
        }

        .image-preview-item {
            position: relative;
            width: 100px;
            height: 100px;
            border-radius: var(--radius-sm);
            overflow: hidden;
            border: 1px solid var(--border);
        }

        .image-preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-preview-remove {
            position: absolute;
            top: 4px;
            left: 4px;
            width: 24px;
            height: 24px;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 0.7rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* ===== TABLE ===== */
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th {
            text-align: right;
            padding: 12px 16px;
            font-size: 0.72rem;
            color: var(--gray-400);
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 700;
            border-bottom: 1px solid var(--border);
        }

        .data-table td {
            padding: 14px 16px;
            font-size: 0.88rem;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
        }

        .data-table tr:hover td {
            background: rgba(255,255,255,0.02);
        }

        .data-table .product-thumb {
            width: 50px;
            height: 50px;
            border-radius: var(--radius-sm);
            object-fit: cover;
            border: 1px solid var(--border);
        }

        .data-table .actions-cell {
            display: flex;
            gap: 6px;
        }

        /* ===== TAG/BADGE ===== */
        .tag {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 50px;
            font-size: 0.7rem;
            font-weight: 700;
        }

        .tag-accent {
            background: rgba(200,169,110,0.15);
            color: var(--accent);
        }

        .tag-info {
            background: var(--info-bg);
            color: var(--info);
        }

        .tag-success {
            background: var(--success-bg);
            color: var(--success);
        }

        /* ===== MODAL ===== */
        .admin-modal-overlay {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 500;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            justify-content: center;
            align-items: center;
            padding: 24px;
        }

        .admin-modal-overlay.active {
            display: flex;
        }

        .admin-modal {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            width: 100%;
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalIn {
            from { opacity: 0; transform: scale(0.92) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .admin-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 24px 28px;
            border-bottom: 1px solid var(--border);
        }

        .admin-modal-title {
            font-size: 1.1rem;
            font-weight: 700;
        }

        .admin-modal-close {
            width: 36px;
            height: 36px;
            background: none;
            border: 1px solid var(--border);
            border-radius: 50%;
            color: var(--gray-300);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }

        .admin-modal-close:hover {
            border-color: var(--accent);
            color: var(--accent);
        }

        .admin-modal-body {
            padding: 28px;
        }

        .admin-modal-footer {
            padding: 16px 28px 24px;
            display: flex;
            gap: 10px;
            justify-content: flex-start;
        }

        /* ===== TOAST ===== */
        .toast-container {
            position: fixed;
            top: 24px;
            left: 24px;
            z-index: 9000;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .toast {
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 14px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.85rem;
            animation: toastIn 0.4s ease, toastOut 0.3s ease 2.7s forwards;
            min-width: 260px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .toast-success { border-color: rgba(34,197,94,0.3); }
        .toast-success i { color: var(--success); }
        .toast-danger { border-color: rgba(239,68,68,0.3); }
        .toast-danger i { color: var(--danger); }

        @keyframes toastIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
            to { opacity: 0; transform: translateX(-20px); }
        }

        /* ===== STATS ROW ===== */
        .stats-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 28px;
        }

        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            background: rgba(200,169,110,0.1);
            color: var(--accent);
            flex-shrink: 0;
        }

        .stat-value {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            font-weight: 800;
            display: block;
        }

        .stat-label {
            font-size: 0.78rem;
            color: var(--gray-400);
        }

        /* ===== SIZE/PRICE PAIRS ===== */
        .size-price-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .size-price-row {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .size-price-row .form-input { flex: 1; }

        .size-price-remove {
            width: 36px;
            height: 36px;
            background: var(--danger-bg);
            color: var(--danger);
            border: 1px solid rgba(239,68,68,0.2);
            border-radius: var(--radius-sm);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            transition: var(--transition);
        }

        .size-price-remove:hover { background: rgba(239,68,68,0.2); }

        /* ===== OVERLAY PREVIEW ===== */
        .overlay-preview {
            position: relative;
            width: 100%;
            max-width: 300px;
            aspect-ratio: 4/5;
            border-radius: var(--radius-sm);
            overflow: hidden;
            border: 1px solid var(--border);
            margin: 16px 0;
        }

        .overlay-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .overlay-preview .overlay-text-preview {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 16px;
            font-weight: 700;
        }

        /* ===== EMPTY STATE ===== */
        .empty-state {
            text-align: center;
            padding: 60px 24px;
            color: var(--gray-400);
        }

        .empty-state i {
            font-size: 3rem;
            display: block;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .empty-state p {
            font-size: 0.95rem;
            margin-bottom: 20px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .sidebar { transform: translateX(100%); }
            .sidebar.open { transform: translateX(0); }
            .main-content { margin-right: 0; padding: 20px 16px; }
            .form-row, .form-row-3 { grid-template-columns: 1fr; }
            .mobile-menu-toggle {
                display: flex !important;
            }
        }

        .mobile-menu-toggle {
            display: none;
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 60;
            width: 44px;
            height: 44px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 50%;
            color: var(--white);
            font-size: 1.1rem;
            cursor: pointer;
            align-items: center;
            justify-content: center;
        }

        /* ===== CATEGORY CHIPS ===== */
        .category-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .category-chip {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--bg-elevated);
            border: 1px solid var(--border);
            border-radius: 50px;
            font-size: 0.82rem;
            color: var(--gray-200);
        }

        .category-chip-remove {
            width: 20px;
            height: 20px;
            background: var(--danger-bg);
            color: var(--danger);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
            transition: var(--transition);
        }

        .category-chip-remove:hover { background: rgba(239,68,68,0.25); }

        .category-chip-edit {
            width: 20px;
            height: 20px;
            background: rgba(200,169,110,0.1);
            color: var(--accent);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.6rem;
            transition: var(--transition);
        }

        .add-inline {
            display: flex;
            gap: 8px;
            margin-top: 16px;
        }

        .add-inline .form-input { flex: 1; }
    `;function Le(){var J,G,Z,K,Q,ee,ne,ae,re,se,te,ie,le,oe;const[E,de]=p.useState(!1),[I,me]=p.useState(""),[V,L]=p.useState(!1),[c,N]=p.useState("dashboard"),[_,C]=p.useState([]),[D,U]=p.useState([]),[T,P]=p.useState({}),[m,R]=p.useState({}),[Ce,W]=p.useState({}),[M,$]=p.useState([]),[j,y]=p.useState([]),[pe,w]=p.useState(!1),[t,B]=p.useState(null),[xe,k]=p.useState(!1),[x,X]=p.useState(null),[ge,S]=p.useState(!1),[d,H]=p.useState(null),[z,q]=p.useState(!1),[A,F]=p.useState(null);p.useEffect(()=>{if(E){v();const n=()=>v();return window.addEventListener("focus",n),()=>window.removeEventListener("focus",n)}},[E]);async function v(){try{const n=f.get("admin_dashboard");if(n&&n.data){const{resP:o,resC:b,resS:g,resH:u,resO:O,resCoupons:ce}=n.data;if(Array.isArray(o)&&C(o),Array.isArray(b)&&U(b),g&&g._id&&(P(g),y(g.announcements||[])),u&&u._id&&R(u),O&&O._id&&W(O),Array.isArray(ce)&&$(ce),n.age<60)return}const[a,s,l,i,r,h]=await Promise.all([fetch("/api/products",{cache:"no-store"}).then(o=>o.json()),fetch("/api/categories",{cache:"no-store"}).then(o=>o.json()),fetch("/api/settings",{cache:"no-store"}).then(o=>o.json()),fetch("/api/hero",{cache:"no-store"}).then(o=>o.json()),fetch("/api/overlay",{cache:"no-store"}).then(o=>o.json()),fetch("/api/coupons",{cache:"no-store"}).then(o=>o.json())]);f.set("admin_dashboard",{resP:a,resC:s,resS:l,resH:i,resO:r,resCoupons:h},60),Array.isArray(a)&&C(a),Array.isArray(s)&&U(s),l&&l._id&&(P(l),y(l.announcements||[])),i&&i._id&&R(i),r&&r._id&&W(r),Array.isArray(h)&&$(h)}catch(n){console.error("API Error:",n)}}const he=n=>{n.preventDefault();const a=localStorage.getItem("bw_admin_password")||"909035";I===a?de(!0):(L(!0),setTimeout(()=>L(!1),2e3))},be=n=>new Promise(a=>{const s=new FileReader;s.onload=l=>{const i=new Image;i.onload=()=>{const r=document.createElement("canvas"),h=800,o=800;let b=i.width,g=i.height;b>g?b>h&&(g*=h/b,b=h):g>o&&(b*=o/g,g=o),r.width=b,r.height=g,r.getContext("2d").drawImage(i,0,0,b,g),a(r.toDataURL("image/jpeg",.7))},i.src=l.target.result},s.readAsDataURL(n)}),Y=async n=>{q(!0);const a=[];for(let s=0;s<n.length;s++){const l=n[s],i=await be(l),r=await new Promise(h=>{try{fetch("/api/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:i})}).then(async o=>{if(!o.ok){console.error("Upload failed with status",o.status),h(i);return}const b=await o.json();h(b.url)}).catch(o=>{console.error("Upload failed",o),h(i)})}catch{h(i)}});r&&a.push(r)}return q(!1),a},ue=(n,a)=>{F(a),n.dataTransfer.effectAllowed="move",setTimeout(()=>{n.target.style.opacity="0.5"},0)},fe=n=>{n.target&&n.target.style&&(n.target.style.opacity="1"),F(null)},ve=n=>{n.preventDefault()},je=async(n,a)=>{if(n.preventDefault(),A===null||A===a)return;const s=[..._],l=s.splice(A,1)[0];s.splice(a,0,l);const i=s.map((r,h)=>({...r,order:h}));C(i);try{await Promise.all(i.map(r=>fetch(`/api/products/${r.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:r.order})}))),f.clearAll()}catch(r){console.error("Error updating order:",r)}},ye=async n=>{var b;n.preventDefault();const a=new FormData(n.target),s={title:{ar:a.get("title_ar"),en:a.get("title_en")},categoryId:a.get("categoryId"),tag:a.get("tag"),stock:Number(a.get("stock"))||0,order:Number(a.get("order"))||0,prices:{}},l=a.getAll("size_name"),i=a.getAll("size_price");l.forEach((g,u)=>{g&&i[u]&&(s.prices[g]=Number(i[u]))});const r=n.target.querySelector('input[type="file"]');if(((b=r==null?void 0:r.files)==null?void 0:b.length)>0){const g=Array.from(r.files).slice(0,4),u=await Y(g);u.length>0&&(s.images=u,s.mainImage=u[0])}const h=t!=null&&t._id?"PUT":"POST",o=t!=null&&t._id?`/api/products/${t.id}`:"/api/products";s.id=t?t.id:Date.now().toString(),await fetch(o,{method:h,headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}),w(!1),f.clearAll(),v()},Ne=async n=>{window.confirm("هل أنت متأكد من الحذف؟")&&(await fetch(`/api/products/${n}`,{method:"DELETE"}),f.clearAll(),v())},we=async n=>{n.preventDefault();const a=new FormData(n.target),s={name:{ar:a.get("name_ar"),en:a.get("name_en")}},l=x!=null&&x._id?"PUT":"POST",i=x!=null&&x._id?`/api/categories/${x.id}`:"/api/categories";s.id=x?x.id:Date.now().toString(),await fetch(i,{method:l,headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}),k(!1),f.clearAll(),v()},ke=async n=>{window.confirm("هل أنت متأكد من الحذف؟")&&(await fetch(`/api/categories/${n}`,{method:"DELETE"}),f.clearAll(),v())},Se=async n=>{n.preventDefault();const a=new FormData(n.target),s={code:a.get("code"),type:a.get("type"),value:Number(a.get("value")),isActive:a.get("isActive")==="on"},l=d!=null&&d._id?"PUT":"POST",i=d!=null&&d._id?`/api/coupons/${d.id}`:"/api/coupons";s.id=d?d.id:Date.now().toString(),await fetch(i,{method:l,headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}),S(!1),f.clearAll(),v()},ze=async n=>{window.confirm("هل أنت متأكد من الحذف؟")&&(await fetch(`/api/coupons/${n}`,{method:"DELETE"}),f.clearAll(),v())},Te=async n=>{var i;n.preventDefault();const a=new FormData(n.target),s={...m,headline:{ar:a.get("headline_ar"),en:a.get("headline_en")},styledWord:{ar:a.get("styledWord_ar"),en:a.get("styledWord_en")},tagline:{ar:a.get("tagline_ar"),en:a.get("tagline_en")},productLabel:{ar:a.get("productLabel_ar"),en:a.get("productLabel_en")},badge:{ar:a.get("badge_ar"),en:a.get("badge_en")},heroPrice:Number(a.get("heroPrice")||299),bgType:a.get("bgType"),bgColor:a.get("bgColor"),bgOpacity:Number(a.get("bgOpacity")||100)},l=n.target.querySelector('input[type="file"]');if(((i=l==null?void 0:l.files)==null?void 0:i.length)>0){const r=await Y(l.files);r&&r.length>0&&(s.image=r[0])}await fetch("/api/hero",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}),alert("تم الحفظ بنجاح"),f.clearAll(),v()},Ae=async n=>{n.preventDefault();const a=new FormData(n.target),s={whatsappNumber:a.get("whatsappNumber"),facebookUrl:a.get("facebookUrl"),instagramUrl:a.get("instagramUrl"),tiktokUrl:a.get("tiktokUrl"),announcements:j};await fetch("/api/settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}),alert("تم الحفظ بنجاح"),f.clearAll(),v()};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:_e}),e.jsxs("div",{className:"admin-body",children:[E?e.jsxs("div",{className:"admin-layout",dir:"rtl",children:[e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-header",children:[e.jsx("img",{src:"/main-logo.jpeg",alt:"Logo",className:"sidebar-logo"}),e.jsxs("div",{className:"sidebar-brand",children:[e.jsx("span",{className:"sidebar-brand-name",children:"Black & White"}),e.jsx("span",{className:"sidebar-brand-sub",children:"لوحة التحكم"})]})]}),e.jsxs("nav",{className:"sidebar-nav",children:[e.jsx("div",{className:"sidebar-section-label",children:"الرئيسية"}),e.jsxs("button",{className:`sidebar-link ${c==="dashboard"?"active":""}`,onClick:()=>N("dashboard"),children:[e.jsx("i",{className:"fa-solid fa-chart-pie"})," الإحصائيات"]}),e.jsx("div",{className:"sidebar-section-label",children:"المتجر"}),e.jsxs("button",{className:`sidebar-link ${c==="products"?"active":""}`,onClick:()=>N("products"),children:[e.jsx("i",{className:"fa-solid fa-shirt"})," المنتجات"]}),e.jsxs("button",{className:`sidebar-link ${c==="categories"?"active":""}`,onClick:()=>N("categories"),children:[e.jsx("i",{className:"fa-solid fa-tags"})," التصنيفات"]}),e.jsxs("button",{className:`sidebar-link ${c==="coupons"?"active":""}`,onClick:()=>N("coupons"),children:[e.jsx("i",{className:"fa-solid fa-ticket"})," أكواد الخصم"]}),e.jsx("div",{className:"sidebar-section-label",children:"الواجهة"}),e.jsxs("button",{className:`sidebar-link ${c==="hero"?"active":""}`,onClick:()=>N("hero"),children:[e.jsx("i",{className:"fa-solid fa-image"})," الرئيسية (Hero)"]}),e.jsxs("button",{className:`sidebar-link ${c==="settings"?"active":""}`,onClick:()=>N("settings"),children:[e.jsx("i",{className:"fa-solid fa-gear"})," الإعدادات العامة"]})]}),e.jsx("div",{className:"sidebar-footer",children:e.jsxs("a",{href:"/",className:"sidebar-back-link",children:[e.jsx("i",{className:"fa-solid fa-arrow-right-from-bracket"})," العودة للمتجر"]})})]}),e.jsxs("main",{className:"main-content",children:[e.jsxs("div",{className:"page-header",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"page-title",children:[c==="dashboard"&&"الإحصائيات",c==="products"&&"المنتجات",c==="categories"&&"التصنيفات",c==="coupons"&&"أكواد الخصم",c==="hero"&&"إعدادات الواجهة",c==="settings"&&"الإعدادات العامة"]}),e.jsx("p",{className:"page-subtitle",children:"إدارة محتوى المتجر وتخصيص الواجهة"})]}),(c==="products"||c==="categories"||c==="coupons")&&e.jsxs("button",{className:"btn btn-primary",onClick:()=>{c==="products"&&(B(null),w(!0)),c==="categories"&&(X(null),k(!0)),c==="coupons"&&(H(null),S(!0))},children:[e.jsx("i",{className:"fa-solid fa-plus"})," إضافة جديد"]})]}),c==="dashboard"&&e.jsx("div",{className:"panel active",children:e.jsxs("div",{className:"stats-row",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",children:e.jsx("i",{className:"fa-solid fa-shirt"})}),e.jsxs("div",{children:[e.jsx("span",{className:"stat-value",children:_.length}),e.jsx("span",{className:"stat-label",children:"منتج"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"var(--info-bg)",color:"var(--info)"},children:e.jsx("i",{className:"fa-solid fa-tags"})}),e.jsxs("div",{children:[e.jsx("span",{className:"stat-value",children:D.length}),e.jsx("span",{className:"stat-label",children:"تصنيف"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"var(--success-bg)",color:"var(--success)"},children:e.jsx("i",{className:"fa-solid fa-ticket"})}),e.jsxs("div",{children:[e.jsx("span",{className:"stat-value",children:M.length}),e.jsx("span",{className:"stat-label",children:"كود خصم"})]})]})]})}),c==="products"&&e.jsx("div",{className:"panel active",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header",children:e.jsxs("h3",{className:"card-title",children:[e.jsx("i",{className:"fa-solid fa-shirt"})," قائمة المنتجات"]})}),e.jsx("div",{style:{overflowX:"auto"},children:e.jsxs("table",{className:"data-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{}),e.jsx("th",{children:"الصورة"}),e.jsx("th",{children:"الاسم"}),e.jsx("th",{children:"التصنيف"}),e.jsx("th",{children:"السعر الأساسي"}),e.jsx("th",{children:"الترتيب"}),e.jsx("th",{children:"الإجراءات"})]})}),e.jsx("tbody",{children:_.map((n,a)=>{var s,l;return e.jsxs("tr",{draggable:!0,onDragStart:i=>ue(i,a),onDragEnd:fe,onDragOver:ve,onDrop:i=>je(i,a),style:{cursor:"move",backgroundColor:A===a?"var(--bg-elevated)":"transparent",transition:"background-color 0.2s"},children:[e.jsx("td",{style:{color:"var(--gray-mid)",textAlign:"center",cursor:"grab"},children:e.jsx("i",{className:"fa-solid fa-grip-vertical"})}),e.jsx("td",{children:e.jsx("img",{src:Ee((s=n.images)==null?void 0:s[0],{context:"thumbnail"}),className:"product-thumb",alt:""})}),e.jsx("td",{children:((l=n.title)==null?void 0:l.ar)||n.title||n.name}),e.jsx("td",{children:e.jsx("span",{className:"tag tag-accent",children:n.categoryId||n.category})}),e.jsxs("td",{style:{color:"var(--accent)",fontWeight:700},children:[Math.min(...Object.values(n.prices||{}))," ج.م"]}),e.jsx("td",{children:n.order||0}),e.jsx("td",{children:e.jsxs("div",{className:"actions-cell",children:[e.jsx("button",{type:"button",className:"btn btn-outline btn-icon",onClick:()=>{B(n),w(!0)},children:e.jsx("i",{className:"fa-solid fa-pen"})}),e.jsx("button",{type:"button",className:"btn btn-danger btn-icon",onClick:()=>Ne(n.id),children:e.jsx("i",{className:"fa-solid fa-trash"})})]})})]},n._id||n.id)})})]})})]})}),c==="categories"&&e.jsx("div",{className:"panel active",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header",children:e.jsxs("h3",{className:"card-title",children:[e.jsx("i",{className:"fa-solid fa-tags"})," الأقسام المتاحة"]})}),e.jsxs("table",{className:"data-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"الاسم"}),e.jsx("th",{children:"الإجراءات"})]})}),e.jsx("tbody",{children:D.map(n=>{var a,s;return e.jsxs("tr",{children:[e.jsx("td",{children:((a=n.name)==null?void 0:a.ar)||n.name}),e.jsx("td",{children:e.jsxs("div",{className:"actions-cell",children:[e.jsx("button",{type:"button",className:"btn btn-outline btn-icon",onClick:()=>{X(n),k(!0)},children:e.jsx("i",{className:"fa-solid fa-pen"})}),e.jsx("button",{type:"button",className:"btn btn-danger btn-icon",onClick:()=>ke(n.id),children:e.jsx("i",{className:"fa-solid fa-trash"})})]})})]},n._id||n.id||((s=n.name)==null?void 0:s.ar)||n.name)})})]})]})}),c==="coupons"&&e.jsx("div",{className:"panel active",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header",children:e.jsxs("h3",{className:"card-title",children:[e.jsx("i",{className:"fa-solid fa-ticket"})," أكواد الخصم"]})}),e.jsxs("table",{className:"data-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"الكود"}),e.jsx("th",{children:"النوع"}),e.jsx("th",{children:"القيمة"}),e.jsx("th",{children:"الحالة"}),e.jsx("th",{children:"الإجراءات"})]})}),e.jsx("tbody",{children:M.map(n=>e.jsxs("tr",{children:[e.jsx("td",{style:{letterSpacing:"2px",fontWeight:"800",color:"var(--white)"},children:n.code}),e.jsx("td",{children:n.type==="percentage"?"نسبة مئوية (%)":"مبلغ ثابت"}),e.jsxs("td",{style:{color:"var(--accent)",fontWeight:700},children:[n.value," ",n.type==="percentage"?"%":"ج.م"]}),e.jsx("td",{children:n.isActive?e.jsx("span",{className:"tag tag-success",children:"نشط"}):e.jsx("span",{className:"tag tag-info",style:{background:"var(--danger-bg)",color:"var(--danger)"},children:"غير نشط"})}),e.jsx("td",{children:e.jsxs("div",{className:"actions-cell",children:[e.jsx("button",{type:"button",className:"btn btn-outline btn-icon",onClick:()=>{H(n),S(!0)},children:e.jsx("i",{className:"fa-solid fa-pen"})}),e.jsx("button",{type:"button",className:"btn btn-danger btn-icon",onClick:()=>ze(n.id),children:e.jsx("i",{className:"fa-solid fa-trash"})})]})})]},n._id||n.id))})]})]})}),c==="hero"&&e.jsx("div",{className:"panel active",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header",children:e.jsxs("h3",{className:"card-title",children:[e.jsx("i",{className:"fa-solid fa-image"})," إعدادات الهيرو (النصوص، الخلفية، الصور)"]})}),e.jsxs("form",{onSubmit:Te,children:[e.jsx("h4",{style:{marginBottom:"16px",color:"var(--accent)"},children:"النصوص الأساسية"}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"العنوان الرئيسي (العربية)"}),e.jsx("input",{type:"text",name:"headline_ar",className:"form-input",defaultValue:((J=m.headline)==null?void 0:J.ar)||m.headline})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"العنوان الرئيسي (English)"}),e.jsx("input",{type:"text",name:"headline_en",className:"form-input",defaultValue:(G=m.headline)==null?void 0:G.en})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الكلمة المميزة (العربية)"}),e.jsx("input",{type:"text",name:"styledWord_ar",className:"form-input",defaultValue:((Z=m.styledWord)==null?void 0:Z.ar)||m.styledWord})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الكلمة المميزة (English)"}),e.jsx("input",{type:"text",name:"styledWord_en",className:"form-input",defaultValue:(K=m.styledWord)==null?void 0:K.en})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الجملة الفرعية (العربية)"}),e.jsx("textarea",{name:"tagline_ar",className:"form-textarea",defaultValue:((Q=m.tagline)==null?void 0:Q.ar)||m.tagline})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الجملة الفرعية (English)"}),e.jsx("textarea",{name:"tagline_en",className:"form-textarea",defaultValue:(ee=m.tagline)==null?void 0:ee.en})]})]}),e.jsx("h4",{style:{marginBottom:"16px",color:"var(--accent)",marginTop:"24px"},children:"عناصر الصورة (الصورة التي تظهر يمين الشاشة)"}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"نص الليبل العائم (العربية)"}),e.jsx("input",{type:"text",name:"productLabel_ar",className:"form-input",defaultValue:((ne=m.productLabel)==null?void 0:ne.ar)||m.productLabel})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"نص الليبل العائم (English)"}),e.jsx("input",{type:"text",name:"productLabel_en",className:"form-input",defaultValue:(ae=m.productLabel)==null?void 0:ae.en})]})]}),e.jsxs("div",{className:"form-row-3",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"نص البادج المائل (العربية)"}),e.jsx("input",{type:"text",name:"badge_ar",className:"form-input",defaultValue:((re=m.badge)==null?void 0:re.ar)||m.badge})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"نص البادج المائل (English)"}),e.jsx("input",{type:"text",name:"badge_en",className:"form-input",defaultValue:(se=m.badge)==null?void 0:se.en})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"السعر المعروض على الصورة (ج.م)"}),e.jsx("input",{type:"number",name:"heroPrice",className:"form-input",defaultValue:m.heroPrice})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الصورة الرئيسية للواجهة"}),e.jsx("input",{type:"file",accept:"image/*",className:"form-input"}),z&&e.jsx("div",{className:"form-hint",style:{color:"var(--accent)"},children:"جاري رفع الصورة..."})]}),e.jsx("h4",{style:{marginBottom:"16px",color:"var(--accent)",marginTop:"24px"},children:"خلفية النصوص (الجزء الأيسر)"}),e.jsxs("div",{className:"form-row-3",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"نوع الخلفية"}),e.jsxs("select",{name:"bgType",className:"form-select",defaultValue:m.bgType||"solid",children:[e.jsx("option",{value:"solid",children:"لون ثابت"}),e.jsx("option",{value:"gradient",children:"تدرج لوني"}),e.jsx("option",{value:"transparent",children:"شفاف"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"لون الخلفية"}),e.jsx("div",{className:"color-picker-wrapper",children:e.jsx("input",{type:"color",name:"bgColor",className:"color-picker-input",defaultValue:m.bgColor||"#0a0a0a"})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"شفافية الخلفية (0 - 100)"}),e.jsx("input",{type:"range",name:"bgOpacity",className:"opacity-slider",min:"0",max:"100",defaultValue:m.bgOpacity||100,style:{marginTop:"12px"}})]})]}),e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:z,style:{marginTop:"24px"},children:"حفظ التغييرات"})]})]})}),c==="settings"&&e.jsx("div",{className:"panel active",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header",children:e.jsxs("h3",{className:"card-title",children:[e.jsx("i",{className:"fa-solid fa-gear"})," الروابط والتواصل"]})}),e.jsxs("form",{onSubmit:Ae,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"رقم واتساب للطلبات"}),e.jsx("input",{type:"text",name:"whatsappNumber",className:"form-input",defaultValue:T.whatsappNumber,placeholder:"201000000000"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"رابط فيسبوك"}),e.jsx("input",{type:"url",name:"facebookUrl",className:"form-input",defaultValue:T.facebookUrl})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"رابط انستغرام"}),e.jsx("input",{type:"url",name:"instagramUrl",className:"form-input",defaultValue:T.instagramUrl})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"رابط تيك توك"}),e.jsx("input",{type:"url",name:"tiktokUrl",className:"form-input",defaultValue:T.tiktokUrl})]}),e.jsx("h4",{style:{marginTop:"30px",color:"var(--accent)",marginBottom:"15px"},children:"شريط الإعلانات العلوي"}),e.jsx("p",{style:{fontSize:"0.85rem",color:"var(--gray-mid)",marginBottom:"15px"},children:"أضف العبارات التي ستتحرك في الشريط الأبيض أعلى الموقع"}),j.map((n,a)=>{var s,l;return e.jsxs("div",{style:{display:"flex",gap:"10px",marginBottom:"10px",alignItems:"center",background:"var(--bg)",padding:"10px",borderRadius:"8px",border:"1px solid var(--border)"},children:[e.jsx("input",{type:"text",className:"form-input",placeholder:"النص (عربي)",value:((s=n.text)==null?void 0:s.ar)||"",onChange:i=>{const r=[...j];r[a]={...r[a],text:{...r[a].text,ar:i.target.value}},y(r)},style:{flex:1}}),e.jsx("input",{type:"text",className:"form-input",placeholder:"النص (English)",value:((l=n.text)==null?void 0:l.en)||"",onChange:i=>{const r=[...j];r[a]={...r[a],text:{...r[a].text,en:i.target.value}},y(r)},style:{flex:1}}),e.jsx("input",{type:"text",className:"form-input",placeholder:"أيقونة (مثل fa-solid fa-star)",value:n.icon||"",onChange:i=>{const r=[...j];r[a]={...r[a],icon:i.target.value},y(r)},style:{flex:.5}}),e.jsx("button",{type:"button",className:"btn btn-danger btn-icon",onClick:()=>{y(j.filter((i,r)=>r!==a))},children:e.jsx("i",{className:"fa-solid fa-trash"})})]},a)}),e.jsxs("button",{type:"button",className:"btn btn-outline",style:{marginTop:"10px",fontSize:"0.9rem"},onClick:()=>{y([...j,{text:{ar:"",en:""},icon:"fa-solid fa-star"}])},children:[e.jsx("i",{className:"fa-solid fa-plus"})," إضافة إعلان جديد"]}),e.jsx("hr",{style:{borderColor:"var(--border)",margin:"30px 0"}}),e.jsx("button",{type:"submit",className:"btn btn-primary",style:{marginTop:"20px"},children:"حفظ التغييرات"})]})]})})]})]}):e.jsx("div",{className:"login-screen",children:e.jsxs("div",{className:"login-card",children:[e.jsx("img",{src:"/main-logo.jpeg",alt:"Logo",className:"login-logo"}),e.jsx("h1",{className:"login-title",children:"Black & White"}),e.jsx("p",{className:"login-sub",children:"لوحة تحكم الإدارة"}),e.jsxs("form",{onSubmit:he,children:[e.jsx("input",{type:"password",className:"login-input",placeholder:"••••",value:I,onChange:n=>me(n.target.value),style:{borderColor:V?"var(--danger)":""}}),e.jsx("button",{type:"submit",className:"login-btn",children:"تسجيل الدخول"}),V&&e.jsx("div",{className:"login-error",style:{display:"block"},children:"كلمة المرور غير صحيحة"})]})]})}),e.jsx("div",{className:`admin-modal-overlay ${pe?"active":""}`,children:e.jsxs("div",{className:"admin-modal",children:[e.jsxs("div",{className:"admin-modal-header",children:[e.jsx("h2",{className:"admin-modal-title",children:t?"تعديل المنتج":"إضافة منتج جديد"}),e.jsx("button",{type:"button",className:"admin-modal-close",onClick:()=>w(!1),children:e.jsx("i",{className:"fa-solid fa-xmark"})})]}),e.jsxs("form",{onSubmit:ye,children:[e.jsxs("div",{className:"admin-modal-body",children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الاسم (العربية)"}),e.jsx("input",{type:"text",name:"title_ar",className:"form-input",defaultValue:((te=t==null?void 0:t.title)==null?void 0:te.ar)||(t==null?void 0:t.title)||(t==null?void 0:t.name),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الاسم (English)"}),e.jsx("input",{type:"text",name:"title_en",className:"form-input",defaultValue:(ie=t==null?void 0:t.title)==null?void 0:ie.en})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"التصنيف"}),e.jsx("select",{name:"categoryId",className:"form-select",defaultValue:(t==null?void 0:t.categoryId)||(t==null?void 0:t.category),required:!0,children:D.map(n=>{var a,s,l;return e.jsx("option",{value:((a=n.name)==null?void 0:a.ar)||n.name,children:((s=n.name)==null?void 0:s.ar)||n.name},n._id||((l=n.name)==null?void 0:l.ar)||n.name)})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"تاج مميز (اختياري)"}),e.jsx("input",{type:"text",name:"tag",className:"form-input",placeholder:"مثال: جديد",defaultValue:t==null?void 0:t.tag})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",style:{width:"100%"},children:[e.jsx("label",{className:"form-label",children:"الكمية المتاحة (المخزون)"}),e.jsx("input",{type:"number",name:"stock",className:"form-input",defaultValue:(t==null?void 0:t.stock)||0,required:!0})]}),e.jsxs("div",{className:"form-group",style:{width:"100%"},children:[e.jsx("label",{className:"form-label",children:"ترتيب الظهور (الأقل يظهر أولاً)"}),e.jsx("input",{type:"number",name:"order",className:"form-input",defaultValue:(t==null?void 0:t.order)||0})]})]}),e.jsxs("div",{className:"form-group",style:{background:"var(--bg)",padding:"20px",borderRadius:"var(--radius-sm)",border:"1px solid var(--border)"},children:[e.jsx("label",{className:"form-label",style:{marginBottom:"16px",color:"var(--accent)"},children:"المقاسات المتاحة وأسعارها"}),e.jsx("div",{className:"size-price-list",children:["S","M","L","XL","XXL"].map(n=>{var a;return e.jsxs("div",{className:"size-price-row",children:[e.jsx("input",{type:"text",name:"size_name",className:"form-input",value:n,readOnly:!0,style:{maxWidth:"80px",textAlign:"center",background:"var(--bg-elevated)"}}),e.jsx("input",{type:"number",name:"size_price",className:"form-input",placeholder:"السعر بالجنيه (اتركه فارغاً للإلغاء)",defaultValue:((a=t==null?void 0:t.prices)==null?void 0:a[n])||""})]},n)})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الصور (بحد أقصى 4 صور - الأولى هي الرئيسية)"}),e.jsx("input",{type:"file",multiple:!0,accept:"image/*",className:"form-input"}),z&&e.jsx("div",{className:"form-hint",style:{color:"var(--accent)",marginTop:"8px"},children:"جاري رفع الصور، يرجى الانتظار..."})]})]}),e.jsxs("div",{className:"admin-modal-footer",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:z,children:z?"جاري الرفع...":"حفظ المنتج"}),e.jsx("button",{type:"button",className:"btn btn-outline",onClick:()=>w(!1),children:"إلغاء"})]})]})]})}),e.jsx("div",{className:`admin-modal-overlay ${xe?"active":""}`,children:e.jsxs("div",{className:"admin-modal",children:[e.jsxs("div",{className:"admin-modal-header",children:[e.jsx("h2",{className:"admin-modal-title",children:x?"تعديل التصنيف":"إضافة تصنيف"}),e.jsx("button",{type:"button",className:"admin-modal-close",onClick:()=>k(!1),children:e.jsx("i",{className:"fa-solid fa-xmark"})})]}),e.jsxs("form",{onSubmit:we,children:[e.jsx("div",{className:"admin-modal-body",children:e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الاسم (العربية)"}),e.jsx("input",{type:"text",name:"name_ar",className:"form-input",defaultValue:((le=x==null?void 0:x.name)==null?void 0:le.ar)||(x==null?void 0:x.name),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"الاسم (English)"}),e.jsx("input",{type:"text",name:"name_en",className:"form-input",defaultValue:(oe=x==null?void 0:x.name)==null?void 0:oe.en})]})]})}),e.jsxs("div",{className:"admin-modal-footer",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",children:"حفظ"}),e.jsx("button",{type:"button",className:"btn btn-outline",onClick:()=>k(!1),children:"إلغاء"})]})]})]})}),e.jsx("div",{className:`admin-modal-overlay ${ge?"active":""}`,children:e.jsxs("div",{className:"admin-modal",children:[e.jsxs("div",{className:"admin-modal-header",children:[e.jsx("h2",{className:"admin-modal-title",children:d?"تعديل الكود":"إضافة كود خصم"}),e.jsx("button",{type:"button",className:"admin-modal-close",onClick:()=>S(!1),children:e.jsx("i",{className:"fa-solid fa-xmark"})})]}),e.jsxs("form",{onSubmit:Se,children:[e.jsxs("div",{className:"admin-modal-body",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"كود الخصم"}),e.jsx("input",{type:"text",name:"code",className:"form-input",defaultValue:d==null?void 0:d.code,required:!0,style:{textTransform:"uppercase",letterSpacing:"2px"}})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"النوع"}),e.jsxs("select",{name:"type",className:"form-select",defaultValue:(d==null?void 0:d.type)||"percentage",required:!0,children:[e.jsx("option",{value:"percentage",children:"نسبة مئوية (%)"}),e.jsx("option",{value:"fixed",children:"مبلغ ثابت"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{className:"form-label",children:"القيمة"}),e.jsx("input",{type:"number",name:"value",className:"form-input",defaultValue:d==null?void 0:d.value,required:!0})]})]}),e.jsxs("div",{className:"form-group",style:{display:"flex",alignItems:"center",gap:"10px",marginTop:"10px"},children:[e.jsx("input",{type:"checkbox",name:"isActive",defaultChecked:d?d.isActive:!0,style:{width:"18px",height:"18px"}}),e.jsx("label",{className:"form-label",style:{margin:0},children:"تفعيل الكود (يمكن للعملاء استخدامه)"})]})]}),e.jsxs("div",{className:"admin-modal-footer",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",children:"حفظ"}),e.jsx("button",{type:"button",className:"btn btn-outline",onClick:()=>S(!1),children:"إلغاء"})]})]})]})})]})]})}export{Le as default};
