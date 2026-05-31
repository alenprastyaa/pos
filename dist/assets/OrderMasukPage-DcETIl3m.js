import{p as Nt,r as m,c as b,o as zt,b as d,a as Ht,w as Lt,d as t,f as g,g as ot,v as gt,B as Mt,A as It,h as Et,u as M,n as R,e as p,t as n,i as f,k as K,F as G}from"./index-B4whDS6x.js";import{S as _,a as Y}from"./sweetalert2.esm.all-BgBW3QO9.js";import{C as Ut}from"./component-Dq0seHOT.js";import{_ as Pt}from"./AdminLayout-CsPIy9zC.js";/* empty css                    */import"./_plugin-vue_export-helper-DlAUqK2U.js";const St={class:"page-container min-h-screen"},Vt={class:"top-panel px-5 pt-4 pb-3"},qt={class:"input-card p-4 rounded-2xl space-y-4"},Bt={class:"grid grid-cols-1 xl:grid-cols-12 gap-4"},Qt={class:"xl:col-span-7"},Ft={class:"xl:col-span-2"},Kt={class:"xl:col-span-3"},Gt={class:"flex flex-wrap items-center gap-2"},Yt={key:0,class:"day-chip-summary h-10 px-4 rounded-full text-sm font-semibold flex items-center"},Jt={class:"px-5 pb-4"},Wt={class:"space-y-4"},Zt={class:"input-card rounded-2xl px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm"},Xt={class:"text-gray-600"},te={class:"font-semibold text-gray-900"},ee={class:"font-semibold text-gray-900"},se={class:"font-semibold text-gray-900"},ae={class:"text-gray-500"},ne={class:"font-semibold text-gray-900"},oe={class:"font-semibold text-gray-900"},le={key:0,class:"cart-table rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm"},ie={key:1,class:"cart-table rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm"},re={class:"px-5 py-4 border-b border-gray-200 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"},de={class:"min-w-0"},pe={class:"flex items-center gap-2 flex-wrap"},ue={class:"text-base font-semibold text-gray-900"},ce={class:"day-count-badge"},xe={class:"text-sm text-gray-500"},me={class:"day-summary-grid grid grid-cols-3 gap-2 text-sm"},ve={class:"day-summary-pill"},ye={class:"font-bold text-gray-900"},ge={class:"day-summary-pill"},fe={class:"font-bold text-gray-900"},be={class:"day-summary-pill"},he={class:"font-bold text-gray-900"},we={class:"divide-y divide-gray-100"},ke={class:"min-w-0"},_e={class:"flex items-center gap-2 flex-wrap"},Te={class:"text-base font-semibold text-gray-900"},je={class:"text-sm text-gray-500 truncate"},Oe={class:"text-xs text-gray-400"},Ce={class:"flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"},De={class:"grid grid-cols-2 gap-4 text-sm"},$e={class:"font-semibold text-gray-900"},Ae={class:"font-semibold text-gray-900"},Re={class:"flex items-center gap-3"},Ne={class:"text-sm font-semibold text-gray-700"},ze=["onClick"],He=["onClick"],Le={key:1,class:"flex gap-2"},Me=["onClick"],Ie={key:2,class:"input-card rounded-2xl px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"},Ee={class:"flex flex-wrap items-center gap-2"},Ue=["disabled"],Pe=["onClick"],Se=["disabled"],Ve={key:0,class:"fixed inset-0 z-50 flex items-center justify-center p-4"},qe={class:"review-modal-card w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"},Be={class:"qty-modal-header px-6 py-5 flex justify-between items-center"},Qe={class:"flex items-center gap-3 min-w-0"},Fe={class:"min-w-0"},Ke={class:"text-lg font-extrabold text-gray-800 truncate"},Ge={class:"text-xs text-gray-600 truncate"},Ye={class:"p-6 grid grid-cols-1 xl:grid-cols-3 gap-5"},Je={class:"xl:col-span-2 space-y-4"},We={class:"review-box rounded-2xl p-4"},Ze={class:"grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"},Xe={class:"font-bold text-gray-900"},ts={class:"font-bold text-gray-900"},es={class:"font-bold text-gray-900"},ss={class:"review-box rounded-2xl overflow-hidden"},as={class:"overflow-x-auto"},ns={class:"w-full"},os={class:"table-head"},ls={key:0,class:"px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-24"},is={class:"px-4 py-3 text-sm font-bold text-gray-500"},rs={class:"px-4 py-3"},ds={class:"text-sm font-bold text-gray-900"},ps={class:"px-4 py-3 text-sm font-mono text-gray-500"},us={class:"px-4 py-3 text-center"},cs=["onUpdate:modelValue","onChange"],xs={key:1,class:"text-sm font-semibold text-gray-700"},ms={class:"px-4 py-3 text-right text-sm font-semibold text-gray-700"},vs={class:"px-4 py-3 text-right text-sm font-extrabold subtotal-text"},ys={key:0,class:"px-4 py-3 text-center"},gs=["onClick"],fs={key:0},bs=["colspan"],hs={class:"space-y-4"},ws={class:"review-summary rounded-2xl p-4 space-y-3"},ks={class:"flex justify-between text-sm text-gray-700"},_s={class:"font-bold"},Ts={class:"flex justify-between text-sm text-gray-700"},js={class:"font-bold"},Os={class:"flex justify-between text-base font-bold text-gray-900"},Cs={class:"space-y-3"},Ds=["disabled"],Ms=Nt({__name:"OrderMasukPage",setup($s){const I="https://alentest.my.id/pos",ft={dateFormat:"Y-m-d",altInput:!0,altFormat:"d F Y",disableMobile:!0},bt=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta",year:"numeric",month:"2-digit",day:"2-digit"}),E=s=>bt.format(s),J=E(new Date),W=new Date;W.setDate(W.getDate()-1);const Z=E(W),X=m(null),tt=m([]),U=m(""),v=m(""),O=m(10),c=m(1),N=m(0),C=m(1),P=m(!1),et=m(!1),x=m(null),S=m([]),T=m([]),V=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),lt=b(()=>{var s,e;return!!((s=X.value)!=null&&s.toko_id)||((e=X.value)==null?void 0:e.role_name)==="superadmin"}),j=b(()=>{var s;return((s=x.value)==null?void 0:s.status)==="pending"}),h=b(()=>j.value?T.value:S.value),it=b(()=>h.value.length),rt=b(()=>h.value.reduce((s,e)=>s+Number(e.qty||0),0)),dt=b(()=>h.value.reduce((s,e)=>s+Number(e.subtotal||0),0)),ht=b(()=>N.value===0?0:(c.value-1)*O.value+1),wt=b(()=>Math.min(c.value*O.value,N.value)),st=b(()=>{const s=a=>{const l=new Date(a);if(Number.isNaN(l.getTime()))return"-";const r=E(l);return r===J?"Hari ini":r===Z?"Kemarin":new Intl.DateTimeFormat("id-ID",{timeZone:"Asia/Jakarta",weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(l)},e=new Map;for(const a of tt.value){const l=new Date(a.createdAt);if(Number.isNaN(l.getTime()))continue;const r=E(l);e.has(r)||e.set(r,{dateKey:r,label:s(a.createdAt),orders:[],totalOrder:0,totalQty:0,totalHarga:0});const i=e.get(r);i&&(i.orders.push(a),i.totalOrder+=1,i.totalQty+=Number(a.total_qty||0),i.totalHarga+=Number(a.total_harga||0))}return Array.from(e.values())}),kt=b(()=>{const s=Math.max(C.value,1),e=new Set;return e.add(1),e.add(s),e.add(c.value-1),e.add(c.value),e.add(c.value+1),Array.from(e).filter(a=>a>=1&&a<=s).sort((a,l)=>a-l)}),w=s=>{const e=Number(s||0);return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(e)},q=s=>new Date(s).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),pt=s=>s==="approved"||s==="completed"?"inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700":s==="rejected"?"inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700":"inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",B=s=>{switch(s){case"approved":return"APPROVED";case"rejected":return"REJECTED";case"completed":return"COMPLETED";default:return"PENDING"}},z=s=>s?s.order_details||s.OrderDetails||s.orderDetails||[]:[],Q=s=>s.map(e=>({...e,qty:Number(e.qty||0),harga:Number(e.harga||0),subtotal:Number(e.subtotal||0)})),_t=async()=>{const s=await Y.get(`${I}/user/my/data`,{headers:V()});s.data.success&&(X.value=s.data.data)},D=async()=>{var s,e;try{P.value=!0;const a={direction:"incoming",page:c.value,limit:O.value},l=U.value.trim();l&&(a.search=l),v.value&&(a.date=v.value);const r=await Y.get(`${I}/order`,{headers:V(),params:a});if(r.data.success){const i=r.data.data;Array.isArray(i)?(tt.value=i,N.value=i.length,C.value=(i.length>0,1)):(tt.value=i.orders||[],N.value=Number(i.totalData||0),C.value=Math.max(Number(i.totalPage||1),1),c.value=Math.min(Number(i.currentPage||c.value),C.value),O.value=Number(i.limit||O.value))}}catch(a){_.fire({icon:"error",title:"Error",text:((e=(s=a.response)==null?void 0:s.data)==null?void 0:e.message)||"Gagal memuat order masuk"})}finally{P.value=!1}},F=async()=>{c.value=1,await D()},Tt=async()=>{U.value="",v.value="",c.value=1,await D()},at=async s=>{s<1||s>C.value||s===c.value||(c.value=s,await D())},nt=async s=>{v.value=s,await F()},jt=s=>{x.value=s,S.value=Q(z(s)),T.value=Q(z(s)),et.value=!0},ut=()=>{et.value=!1,x.value=null,S.value=[],T.value=[]},ct=s=>{j.value&&(T.value=T.value.filter((e,a)=>a!==s))},Ot=(s,e)=>{if(!j.value)return;const a=Number(e||0);if(a<1){ct(s);return}T.value=T.value.map((l,r)=>r!==s?l:{...l,qty:a,subtotal:a*Number(l.harga||0)})},Ct=()=>{var i,$;if(!x.value)return"";const s=x.value,e=h.value,a=Number(dt.value||0),l=Number(rt.value||0),r=Number(it.value||0);return`
    <div style="
        width: 280px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        letter-spacing: 1px;
        line-height: 1.5;
        padding: 10px;
        text-align: center;
        margin-left: 20px;
        color: #000;
    ">
        <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">${(((i=s.target_toko)==null?void 0:i.nama_toko)||"TOKO").toUpperCase()}</div>
            <div style="font-size: 11px;">REVIEW ORDER MASUK</div>
        </div>

        <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>ID: ${s.id.substring(0,8)}</span>
                <span>Status: ${B(s.status)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Tgl:</span>
                <span>${q(s.createdAt)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <span>Dari:</span>
                <span>${(($=s.source_toko)==null?void 0:$.nama_toko)||"-"}</span>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 10px 0 5px 0; border-bottom: 1px dashed #000; padding-bottom: 5px;">
            <span style="flex: 1; text-align: left;">ITEM</span>
            <span style="width: 30px; text-align: center;">QTY</span>
            <span style="width: 60px; text-align: right;">HARGA</span>
            <span style="width: 60px; text-align: right;">TOTAL</span>
        </div>

        <div style="margin-bottom: 10px;">
            ${e.map(y=>`
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; align-items: flex-start;">
                    <span style="flex: 1; text-align: left; word-break: break-word; padding-right: 5px;">
                        ${y.nama_produk}
                    </span>
                    <span style="width: 30px; text-align: center;">${y.qty}</span>
                    <span style="width: 60px; text-align: right;">${w(Number(y.harga||0))}</span>
                    <span style="width: 60px; text-align: right;">${w(Number(y.subtotal||0))}</span>
                </div>
            `).join("")}
        </div>

        <div style="border-top: 2px dashed #000; margin: 10px 0; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL ITEM:</span>
                <span>${r}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>TOTAL QTY:</span>
                <span>${l}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL HARGA:</span>
                <span>${w(a)}</span>
            </div>
        </div>

        <div style="margin-top: 15px; font-size: 11px; line-height: 1.6; color: #333;">
            <div>Terima Kasih Atas Review Anda</div>
            <div style="margin: 4px 0;">Periksa order sebelum diproses</div>
            <div style="font-size: 10px;">Order yang sudah disetujui<br>silakan review dan cetak laporan</div>
        </div>
    </div>
  `},xt=()=>{var i;const s=Ct();if(!s)return;const e=`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Review Order ${((i=x.value)==null?void 0:i.order_code)||""}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000; }
          @media print {
            @page { margin: 0; size: auto; }
            body { width: 100%; background-color: #fff; }
          }
        </style>
      </head>
      <body onload="window.print(); setTimeout(() => window.close(), 1000);">
        ${s}
      </body>
    </html>`,a=new Blob([e],{type:"text/html;charset=utf-8"}),l=URL.createObjectURL(a);if(!window.open(l,"_blank","width=400,height=600")){_.fire("Error","Pop-up print diblokir browser.","error"),URL.revokeObjectURL(l);return}setTimeout(()=>URL.revokeObjectURL(l),3e4)},Dt=async()=>{var s,e;if(x.value){if(h.value.length===0){_.fire("Peringatan","Order tidak boleh kosong.","warning");return}try{const a=await Y.post(`${I}/order/${x.value.id}/approve`,{items:h.value.map(l=>({produk_id:l.produk_id,barcode:l.barcode,qty:l.qty,harga:l.harga}))},{headers:V()});a.data.success&&(x.value=a.data.data,S.value=Q(z(a.data.data)),T.value=Q(z(a.data.data)),await _.fire({icon:"success",title:"Order disetujui",text:"Order sudah direview. Silakan print jika diperlukan.",timer:1600}),await D())}catch(a){_.fire({icon:"error",title:"Gagal",text:((e=(s=a.response)==null?void 0:s.data)==null?void 0:e.message)||"Gagal menyetujui order"})}}},$t=s=>{var H,L;const e=z(s),a=Number(s.total_harga||0),l=Number(s.total_qty||0),r=Number(s.total_item||0),i=q(s.createdAt),$=B(s.status),y=k=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(k);return`
    <div style="
        width: 280px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        letter-spacing: 1px;
        line-height: 1.5;
        padding: 10px;
        text-align: center;
        margin-left: 20px;
        color: #000;
    ">
        <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">${(((H=s.target_toko)==null?void 0:H.nama_toko)||"TOKO").toUpperCase()}</div>
            <div style="font-size: 11px;">REVIEW ORDER MASUK</div>
        </div>

        <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>ID: ${s.id.substring(0,8)}</span>
                <span>Status: ${$}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Tgl:</span>
                <span>${i}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <span>Dari:</span>
                <span>${((L=s.source_toko)==null?void 0:L.nama_toko)||"-"}</span>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 10px 0 5px 0; border-bottom: 1px dashed #000; padding-bottom: 5px;">
            <span style="flex: 1; text-align: left;">ITEM</span>
            <span style="width: 30px; text-align: center;">QTY</span>
            <span style="width: 60px; text-align: right;">HARGA</span>
            <span style="width: 60px; text-align: right;">TOTAL</span>
        </div>

        <div style="margin-bottom: 10px;">
            ${e.map(k=>`
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; align-items: flex-start;">
                    <span style="flex: 1; text-align: left; word-break: break-word; padding-right: 5px;">
                        ${k.nama_produk}
                    </span>
                    <span style="width: 30px; text-align: center;">${k.qty}</span>
                    <span style="width: 60px; text-align: right;">${y(Number(k.harga||0))}</span>
                    <span style="width: 60px; text-align: right;">${y(Number(k.subtotal||0))}</span>
                </div>
            `).join("")}
        </div>

        <div style="border-top: 2px dashed #000; margin: 10px 0; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL ITEM:</span>
                <span>${r}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>TOTAL QTY:</span>
                <span>${l}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL HARGA:</span>
                <span>${y(a)}</span>
            </div>
        </div>

        <div style="margin-top: 15px; font-size: 11px; line-height: 1.6; color: #333;">
            <div>Terima Kasih Atas Review Anda</div>
            <div style="margin: 4px 0;">Periksa order sebelum diproses</div>
            <div style="font-size: 10px;">Order yang sudah disetujui<br>silakan review dan cetak laporan</div>
        </div>
    </div>
  `},At=s=>{const e=$t(s),a=`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Order ${s.order_code}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000; }
          @media print {
            @page { margin: 0; size: auto; }
            body { width: 100%; background-color: #fff; }
          }
        </style>
      </head>
      <body onload="window.print(); setTimeout(() => window.close(), 1000);">
        ${e}
      </body>
    </html>`,l=new Blob([a],{type:"text/html;charset=utf-8"}),r=URL.createObjectURL(l);if(!window.open(r,"_blank","width=400,height=600")){_.fire("Error","Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.","error"),URL.revokeObjectURL(r);return}setTimeout(()=>URL.revokeObjectURL(r),3e4)},Rt=async s=>{var e,a;try{(await Y.post(`${I}/order/${s}/reject`,{},{headers:V()})).data.success&&(await _.fire({icon:"success",title:"Order ditolak",timer:1400}),await D())}catch(l){_.fire({icon:"error",title:"Gagal",text:((a=(e=l.response)==null?void 0:e.data)==null?void 0:a.message)||"Gagal menolak order"})}};return zt(async()=>{var s,e;try{await Promise.all([_t(),D()])}catch(a){_.fire({icon:"error",title:"Error",text:((e=(s=a.response)==null?void 0:s.data)==null?void 0:e.message)||"Gagal memuat halaman order masuk"})}}),(s,e)=>(d(),Ht(Pt,null,{default:Lt(()=>{var a,l,r,i,$,y,H,L,k,mt,vt;return[t("div",St,[t("div",Vt,[t("div",qt,[t("div",{class:"flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"},[e[8]||(e[8]=t("div",null,[t("h1",{class:"text-xl font-bold text-gray-900"},"Order Masuk"),t("p",{class:"text-sm text-gray-500"},"Kelola order yang masuk ke toko Anda.")],-1)),t("div",{class:"flex flex-wrap gap-2"},[t("button",{type:"button",onClick:F,class:"btn-confirm h-11 px-4 text-sm font-semibold rounded-2xl transition-all"}," Cari "),t("button",{type:"button",onClick:Tt,class:"btn-refresh h-11 px-4 text-sm font-semibold rounded-2xl transition-all"}," Reset "),t("button",{type:"button",onClick:D,class:"btn-bayar h-11 px-4 text-sm font-semibold rounded-2xl transition-all"}," Refresh ")])]),t("div",Bt,[t("div",Qt,[e[9]||(e[9]=t("label",{class:"input-label flex items-center gap-2 mb-2"},[t("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})]),g(" Search ")],-1)),ot(t("input",{"onUpdate:modelValue":e[0]||(e[0]=o=>U.value=o),type:"text",placeholder:"Cari kode order atau nama toko...",onKeyup:Mt(F,["enter"]),class:"pos-input w-full h-11 px-4 rounded-xl"},null,544),[[gt,U.value]])]),t("div",Ft,[e[11]||(e[11]=t("label",{class:"input-label flex items-center gap-2 mb-2"},[t("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-7 7v5l-4 2v-7L3 6V4z"})]),g(" Limit ")],-1)),ot(t("select",{"onUpdate:modelValue":e[1]||(e[1]=o=>O.value=o),onChange:F,class:"pos-input w-full h-11 px-4 rounded-xl"},e[10]||(e[10]=[t("option",{value:5},"5 / halaman",-1),t("option",{value:10},"10 / halaman",-1),t("option",{value:25},"25 / halaman",-1),t("option",{value:50},"50 / halaman",-1)]),544),[[It,O.value,void 0,{number:!0}]])]),t("div",Kt,[e[12]||(e[12]=t("label",{class:"input-label flex items-center gap-2 mb-2"},[t("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})]),g(" Filter Hari ")],-1)),Et(M(Ut),{modelValue:v.value,"onUpdate:modelValue":e[2]||(e[2]=o=>v.value=o),config:ft,placeholder:"Pilih tanggal...",class:"pos-input w-full h-11 px-4 rounded-xl"},null,8,["modelValue"])])]),t("div",Gt,[t("button",{type:"button",onClick:e[3]||(e[3]=o=>nt("")),class:R([v.value===""?"day-chip-active":"day-chip","day-chip h-10 px-4 rounded-full text-sm font-semibold transition-all"])}," Semua Hari ",2),t("button",{type:"button",onClick:e[4]||(e[4]=o=>nt(M(J))),class:R([v.value===M(J)?"day-chip-active":"day-chip","day-chip h-10 px-4 rounded-full text-sm font-semibold transition-all"])}," Hari Ini ",2),t("button",{type:"button",onClick:e[5]||(e[5]=o=>nt(M(Z))),class:R([v.value===M(Z)?"day-chip-active":"day-chip","day-chip h-10 px-4 rounded-full text-sm font-semibold transition-all"])}," Kemarin ",2),v.value?(d(),p("div",Yt," Filter aktif: "+n(v.value),1)):f("",!0)])])]),t("div",Jt,[t("div",Wt,[t("div",Zt,[t("div",Xt,[e[13]||(e[13]=g(" Menampilkan ")),t("span",te,n(ht.value),1),e[14]||(e[14]=g(" - ")),t("span",ee,n(wt.value),1),e[15]||(e[15]=g(" dari ")),t("span",se,n(N.value),1),e[16]||(e[16]=g(" order "))]),t("div",ae,[e[17]||(e[17]=g(" Halaman ")),t("span",ne,n(c.value),1),e[18]||(e[18]=g(" dari ")),t("span",oe,n(C.value),1)])]),st.value.length===0&&!P.value?(d(),p("div",le," Belum ada order masuk. ")):f("",!0),P.value?(d(),p("div",ie," Memuat order masuk... ")):f("",!0),(d(!0),p(G,null,K(st.value,o=>(d(),p("div",{key:o.dateKey,class:"cart-table rounded-2xl overflow-hidden shadow-sm"},[t("div",re,[t("div",de,[t("div",pe,[t("h2",ue,n(o.label),1),t("span",ce,n(o.totalOrder)+" order",1)]),t("p",xe,n(o.dateKey)+" • Total qty "+n(o.totalQty)+" • "+n(w(o.totalHarga)),1)]),t("div",me,[t("div",ve,[e[19]||(e[19]=t("p",{class:"text-[11px] uppercase tracking-wider text-gray-500"},"Order",-1)),t("p",ye,n(o.totalOrder),1)]),t("div",ge,[e[20]||(e[20]=t("p",{class:"text-[11px] uppercase tracking-wider text-gray-500"},"Qty",-1)),t("p",fe,n(o.totalQty),1)]),t("div",be,[e[21]||(e[21]=t("p",{class:"text-[11px] uppercase tracking-wider text-gray-500"},"Nilai",-1)),t("p",he,n(w(o.totalHarga)),1)])])]),t("div",we,[(d(!0),p(G,null,K(o.orders,u=>{var A;return d(),p("div",{key:u.id,class:"px-5 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"},[t("div",ke,[t("div",_e,[t("h3",Te,n(u.order_code),1),t("span",{class:R(pt(u.status))},n(B(u.status)),3)]),t("p",je," Dari "+n(((A=u.source_toko)==null?void 0:A.nama_toko)||"-"),1),t("p",Oe,n(q(u.createdAt)),1)]),t("div",Ce,[t("div",De,[t("div",null,[e[22]||(e[22]=t("p",{class:"text-gray-500"},"Item",-1)),t("p",$e,n(u.total_item),1)]),t("div",null,[e[23]||(e[23]=t("p",{class:"text-gray-500"},"Qty",-1)),t("p",Ae,n(u.total_qty),1)])]),t("div",Re,[t("p",Ne,n(w(u.total_harga)),1),t("button",{type:"button",onClick:yt=>At(u),class:"btn-confirm rounded-xl px-3 py-2 text-sm font-medium transition"}," Print ",8,ze),u.status==="pending"&&lt.value?(d(),p("button",{key:0,type:"button",onClick:yt=>jt(u),class:"btn-load rounded-xl px-3 py-2 text-sm font-medium transition"}," Review ",8,He)):f("",!0),u.status==="pending"&&lt.value?(d(),p("div",Le,[t("button",{type:"button",onClick:yt=>Rt(u.id),class:"btn-del rounded-xl px-3 py-2 text-sm font-medium transition"}," Tolak ",8,Me)])):f("",!0)])])])}),128))])]))),128)),st.value.length>0?(d(),p("div",Ie,[e[24]||(e[24]=t("p",{class:"text-sm text-gray-600"}," Tampilkan data per halaman untuk memudahkan membaca order harian. ",-1)),t("div",Ee,[t("button",{type:"button",disabled:c.value===1,onClick:e[6]||(e[6]=o=>at(c.value-1)),class:"pagination-btn h-10 px-4 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"}," Sebelumnya ",8,Ue),(d(!0),p(G,null,K(kt.value,o=>(d(),p("button",{key:o,type:"button",onClick:u=>at(o),class:R([o===c.value?"pagination-btn-active":"pagination-btn","h-10 min-w-10 px-4 rounded-xl text-sm font-semibold transition-all"])},n(o),11,Pe))),128)),t("button",{type:"button",disabled:c.value===C.value,onClick:e[7]||(e[7]=o=>at(c.value+1)),class:"pagination-btn h-10 px-4 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"}," Berikutnya ",8,Se)])])):f("",!0)])])]),et.value?(d(),p("div",Ve,[t("div",{class:"qty-modal-backdrop absolute inset-0 transition-opacity",onClick:ut}),t("div",qe,[t("div",Be,[t("div",Qe,[e[25]||(e[25]=t("div",{class:"qty-modal-icon w-10 h-10 rounded-xl flex items-center justify-center"},[t("svg",{class:"w-5 h-5 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2.5",d:"M9 12h6m-3-3v6m7-6v6a2 2 0 01-2 2h-1l-2 3h-4l-2-3H6a2 2 0 01-2-2v-6m16 0V8a2 2 0 00-2-2h-3l-2-3H9L7 6H4a2 2 0 00-2 2v4"})])],-1)),t("div",Fe,[t("h3",Ke," Review Order "+n(((a=x.value)==null?void 0:a.order_code)||"-"),1),t("p",Ge," Dari "+n(((r=(l=x.value)==null?void 0:l.source_toko)==null?void 0:r.nama_toko)||"-")+" ke "+n((($=(i=x.value)==null?void 0:i.target_toko)==null?void 0:$.nama_toko)||"-"),1)])]),t("div",{class:"flex items-center gap-2"},[t("button",{type:"button",onClick:xt,class:"btn-confirm rounded-xl px-4 py-2 text-sm font-semibold transition"}," Print Order Lengkap "),t("button",{type:"button",onClick:ut,class:"qty-close-btn p-2 rounded-xl transition-all"},e[26]||(e[26]=[t("svg",{class:"w-5 h-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M6 18L18 6M6 6l12 12"})],-1)]))])]),t("div",Ye,[t("div",Je,[t("div",We,[t("div",Ze,[t("div",null,[e[27]||(e[27]=t("p",{class:"text-gray-500"},"Kode Order",-1)),t("p",Xe,n(((y=x.value)==null?void 0:y.order_code)||"-"),1)]),t("div",null,[e[28]||(e[28]=t("p",{class:"text-gray-500"},"Status",-1)),t("span",{class:R(pt(((H=x.value)==null?void 0:H.status)||"pending"))},n(B(((L=x.value)==null?void 0:L.status)||"pending")),3)]),t("div",null,[e[29]||(e[29]=t("p",{class:"text-gray-500"},"Tanggal",-1)),t("p",ts,n(q(((k=x.value)==null?void 0:k.createdAt)||"")),1)]),t("div",null,[e[30]||(e[30]=t("p",{class:"text-gray-500"},"Dari",-1)),t("p",es,n(((vt=(mt=x.value)==null?void 0:mt.source_toko)==null?void 0:vt.nama_toko)||"-"),1)])])]),t("div",ss,[t("div",as,[t("table",ns,[t("thead",null,[t("tr",os,[e[31]||(e[31]=t("th",{class:"px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-12"},"No",-1)),e[32]||(e[32]=t("th",{class:"px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider"},"Produk",-1)),e[33]||(e[33]=t("th",{class:"px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-32"},"Barcode",-1)),e[34]||(e[34]=t("th",{class:"px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-24"},"Qty",-1)),e[35]||(e[35]=t("th",{class:"px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider"},"Harga",-1)),e[36]||(e[36]=t("th",{class:"px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider"},"Subtotal",-1)),j.value?(d(),p("th",ls,"Aksi")):f("",!0)])]),t("tbody",null,[(d(!0),p(G,null,K(h.value,(o,u)=>(d(),p("tr",{key:o.id||`${o.barcode}-${u}`,class:"cart-row"},[t("td",is,n(u+1),1),t("td",rs,[t("div",ds,n(o.nama_produk),1)]),t("td",ps,n(o.barcode),1),t("td",us,[j.value?ot((d(),p("input",{key:0,"onUpdate:modelValue":A=>o.qty=A,type:"number",min:"1",class:"qty-input w-20 text-center rounded-lg py-1.5 text-sm font-bold",onChange:A=>Ot(u,o.qty)},null,40,cs)),[[gt,o.qty,void 0,{number:!0}]]):(d(),p("span",xs,n(o.qty),1))]),t("td",ms,n(w(o.harga)),1),t("td",vs,n(w(o.subtotal)),1),j.value?(d(),p("td",ys,[t("button",{type:"button",onClick:A=>ct(u),class:"del-btn p-2 rounded-xl transition-all"},e[37]||(e[37]=[t("svg",{class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,gs)])):f("",!0)]))),128)),h.value.length===0?(d(),p("tr",fs,[t("td",{colspan:j.value?7:6,class:"px-6 py-10 text-center text-sm text-gray-500"}," Semua item sudah dihapus. Tambahkan lagi sebelum approve. ",8,bs)])):f("",!0)])])])])]),t("div",hs,[t("div",ws,[t("div",ks,[e[38]||(e[38]=t("span",null,"Total Item",-1)),t("span",_s,n(it.value),1)]),t("div",Ts,[e[39]||(e[39]=t("span",null,"Total Qty",-1)),t("span",js,n(rt.value),1)]),e[41]||(e[41]=t("div",{class:"divider my-1"},null,-1)),t("div",Os,[e[40]||(e[40]=t("span",null,"Total Harga",-1)),t("span",null,n(w(dt.value)),1)])]),t("div",Cs,[j.value?(d(),p("button",{key:0,type:"button",onClick:Dt,disabled:h.value.length===0,class:"w-full h-14 btn-load rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"},e[42]||(e[42]=[t("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2.5",d:"M5 13l4 4L19 7"})],-1),g(" SETUJUI ")]),8,Ds)):f("",!0),t("button",{type:"button",onClick:xt,class:"w-full h-14 btn-bayar rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 transition-all"},e[43]||(e[43]=[t("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2.5",d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2m-8 8H5a2 2 0 01-2-2v-4a2 2 0 012-2h2m8 8V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10m8 0a2 2 0 01-2 2H9a2 2 0 01-2-2m8 0H7"})],-1),g(" PRINT ")]))])])])])])):f("",!0)]}),_:1}))}});export{Ms as default};
