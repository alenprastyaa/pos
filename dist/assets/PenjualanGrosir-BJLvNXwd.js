import{j as Re,r as l,c as F,y as Ae,o as Ee,b as c,a as He,w as qe,d as a,p as ee,v as re,u as Ke,e as m,F as V,h as O,q as S,z as Me,n as D,t as o,f as te,B as Le,x as ie,i as Fe,A as U}from"./index--dIsnzV1.js";import{a as M,S as i}from"./sweetalert2.esm.all-BgBW3QO9.js";import{_ as Ve}from"./AdminLayout-BWr9N-kK.js";import{_ as Oe}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Ue={class:"page-container min-h-screen py-2 space-y-2"},Ge={class:"grid grid-cols-1 lg:grid-cols-3 gap-4"},Ye={class:"lg:col-span-2 relative"},Je=["disabled"],We={key:0,class:"dropdown-container absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-10 max-h-200 overflow-y-auto"},Qe=["onClick"],Xe={style:{"font-size":"14px"},class:"dropdown-text space-y-1 border border-gray-200 p-2"},Ze={class:"font-semibold"},et={class:"text-green-600 font-medium"},tt={key:0,disabled:""},at=["value"],nt={key:0,class:"card-section p-4 rounded-lg border"},st={class:"flex justify-between items-center"},lt={key:1,class:"space-y-3"},ot={class:"flex items-center gap-2"},rt={class:"text-sm font-bold text-title"},it={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"},dt={class:"mb-3"},ut={class:"text-sm font-semibold text-title"},ct={class:"text-lg font-bold text-warning mt-1"},pt={class:"text-xs text-muted mt-2"},mt={class:"flex gap-2 justify-end"},gt=["onClick"],vt=["onClick"],ft={class:"card-section rounded-lg shadow-sm border overflow-hidden"},bt={class:"overflow-x-auto"},yt={class:"w-full"},ht={class:"divide-y divide-border"},xt={key:0},kt={class:"px-6 py-1 text-sm text-body font-medium"},_t={class:"px-6 py-1"},wt={style:{"font-size":"12px"},class:"text-body leading-tight"},Bt={class:"px-6 py-1 text-center"},Tt=["onUpdate:modelValue","onChange"],jt={class:"px-6 py-1 text-right text-sm text-muted-dark"},Pt={class:"px-6 py-1 text-right text-sm font-semibold text-body"},Ct={class:"px-6 py-1 text-center"},$t=["onClick"],It={class:"px-6 py-2 bg-footer border-t flex justify-between items-center"},St={class:"text-xl text-primary"},Dt={class:"space-y-4 mt-4"},Nt={class:"relative"},zt=["value"],Rt={class:"card-section p-5 border rounded-lg space-y-3"},At={class:"flex justify-between text-sm"},Et={class:"flex justify-between text-sm"},Ht={class:"font-semibold text-body"},qt={class:"flex justify-between text-sm border-t pt-3 border-divider"},Kt={class:"font-semibold text-body"},Mt={class:"grid grid-cols-1 md:grid-cols-3 gap-4"},Lt=["disabled"],Ft={key:0,class:"animate-spin h-5 w-5",fill:"none",viewBox:"0 0 24 24"},Vt=["disabled"],de="pendingTransactions",Ot=Re({__name:"PenjualanGrosir",setup(Ut){const ue=Fe(),N="https://alentest.my.id/pos",k=l(0),ce=localStorage.getItem("role_name"),v=l(-1),G=l([]),Y=l(!1),z=l(!1),p=l(""),g=l(0),pe=l(""),L=l(null),d=l([]),h=l([]),T=l(null),j=l(null),R=l(""),f=l([]),_=l(!1),A=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),me=F(()=>{var e;return((e=j.value)==null?void 0:e.role_name)==="superadmin"});l([]);const ge=l("");l(!1);const E=l(""),J=F(()=>{const e=Number(k.value)||0,t=Number(w.value)||0;return e+t}),ae=l(null),W=l(null),ve=e=>{/\d/.test(e.key)&&e.preventDefault()},fe=e=>{const t=e.replace(/\D/g,""),n=parseInt(t)||0;g.value=n,t===""?E.value="":E.value=new Intl.NumberFormat("id-ID").format(n)},be=e=>{const t=e.target;fe(t.value)},ye=e=>{const t=e.target;g.value>0&&(t.value=g.value.toString())},he=e=>{const t=e.target;g.value>0&&(t.value=E.value)},xe=e=>{e.key==="Enter"&&(e.preventDefault(),U(()=>{var t,n;(t=W.value)==null||t.focus(),(n=W.value)==null||n.click()}))},ke=async e=>{if(!e.trim()){f.value=[],_.value=!1;return}try{const t=await M.get(`${N}/produk`,{params:{search:e},headers:A()});t.data.success&&t.data.data.data&&(f.value=t.data.data.data.map(n=>({barcode:n.barcode,qty:1,nama_produk:n.nama_produk,harga_jual_ritel:parseFloat(n.harga_jual_ritel)})),_.value=!0,v.value=-1)}catch(t){console.error("Error searching products:",t),f.value=[]}},_e=e=>{if(!(!_.value||f.value.length===0))switch(e.key){case"ArrowDown":e.preventDefault(),v.value=Math.min(v.value+1,f.value.length-1);break;case"ArrowUp":e.preventDefault(),v.value=Math.max(v.value-1,-1);break;case"Enter":e.preventDefault(),v.value>=0&&ne(f.value[v.value]);break;case"Escape":e.preventDefault(),_.value=!1,v.value=-1;break}},ne=async e=>{const t=await ze(e);t!==null&&(je(e,t),i.fire({icon:"success",title:"Berhasil",text:`${t} ${e.nama_produk} ditambahkan`,timer:1500,showConfirmButton:!1})),R.value="",f.value=[],_.value=!1,v.value=-1,U(()=>{var n;(n=L.value)==null||n.focus()})},r=e=>e==null||isNaN(e)?"Rp 0":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),we=e=>new Date(e).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),w=F(()=>d.value.reduce((e,t)=>e+t.qty*t.harga_jual_ritel,0)),P=F(()=>{const e=Number(g.value)||0,t=Number(J.value)||0;return e-t}),Be=async()=>{try{const e=await M.get(`${N}/user/my/data`,{headers:A()});e.data.success&&(j.value={full_name:e.data.data.full_name,role_name:e.data.data.role_name,toko:{id:e.data.data.toko.id,nama_toko:e.data.data.toko.nama_toko,alamat:e.data.data.toko.alamat}})}catch(e){console.error("Gagal mengambil data kasir:",e)}},se=async e=>{try{const t=await M.get(`${N}/pelanggan/${e}`,{headers:A()});t.data.success&&t.data.data&&(k.value=Number(t.data.data.hutang)||0)}catch(t){console.error("Gagal mengambil hutang pelanggan:",t),k.value=0}};Ae(p,async e=>{e?(await se(e),U(()=>{var t;(t=ae.value)==null||t.focus()})):k.value=0});const Te=async()=>{Y.value=!0;try{const e=await M.get(`${N}/pelanggan`,{headers:A()});e.data.success&&(G.value=e.data.data)}catch(e){console.error("Gagal mengambil data pelanggan:",e)}finally{Y.value=!1}},Q=()=>{p.value="",g.value=0,E.value="",d.value=[],pe.value="",T.value=null,U(()=>{var e;(e=L.value)==null||e.focus(),R.value="",f.value=[],_.value=!1})},je=(e,t=1)=>{const n=d.value.find(s=>s.barcode===e.barcode);n?(n.qty+=t,d.value=[n,...d.value.filter(s=>s.barcode!==e.barcode)]):d.value.unshift({barcode:e.barcode,qty:t,nama_produk:e.nama_produk,harga_jual_ritel:parseFloat(e.harga_jual_ritel)})},Pe=(e,t)=>{const n=d.value.find(s=>s.barcode===e);n&&(t<=0||isNaN(t)?le(e):n.qty=t)},le=e=>{d.value=d.value.filter(t=>t.barcode!==e)},oe=()=>{try{localStorage.setItem(de,JSON.stringify(h.value))}catch(e){console.error("Error saving pending transactions:",e)}},Ce=()=>{try{const e=localStorage.getItem(de);h.value=e?JSON.parse(e):[]}catch(e){console.error("Error loading pending transactions:",e),h.value=[]}},$e=async()=>{if(d.value.length===0){i.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!p.value){i.fire("Peringatan","Pelanggan harus dipilih untuk menyimpan transaksi pending.","warning");return}const e=G.value.find(s=>s.id===p.value),t=e?e.nama_pelanggan:"Pelanggan Tidak Dikenal",n={id:Date.now(),pelanggan_id:p.value,nama_pelanggan:t,items:[...d.value],tanggal_simpan:new Date().toLocaleString("id-ID"),total:w.value};h.value.push(n),oe(),i.fire("Berhasil","Transaksi telah disimpan sebagai pending.","success"),Q()},Ie=e=>{Q(),p.value=e.pelanggan_id,d.value=e.items,g.value=0,T.value=e.id,i.fire("Dimuat",`Transaksi untuk ${e.nama_pelanggan} telah dimuat ke keranjang.`,"info"),X(T.value,!1)},X=(e,t=!0)=>{h.value=h.value.filter(n=>n.id!==e),oe(),t&&i.fire("Berhasil","Transaksi pending telah dihapus.","success")},Se=(e,t,n,s,b,C)=>{const $=e.total_bayar,u=e.total_harga,B=e.total_kembalian,I=e.sisa_hutang,x=y=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(y);return`
        <div style="
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000; 
            width: 100%;
            padding-left: 20px;
            padding-right: 5px;
        ">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 14px; margin-bottom: 5px;">${b.toUpperCase()}</div>
                <div style="font-size: 10px; line-height: 1.2;">
                    ${C.replace(/\n/g,"<br>")}
                </div>
            </div>

            <div style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 5px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>ID: ${e.id.substring(0,8)}</span>
                    <span>${we(e.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                    <span>Kasir: ${s}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Plg: ${t}</span>
                </div>
            </div>

            <div style="margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
                ${n.map(y=>`
                    <div style="margin-bottom: 6px;">
                        <div style="margin-bottom: 2px;">
                            ${y.nama_produk}
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 10px;">
                            <span>${y.qty}x Rp ${x(y.harga_jual_ritel)}</span>
                            <span>Rp ${x(y.qty*y.harga_jual_ritel)}</span>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px;">
                    <span>TOTAL:</span>
                    <span>Rp ${x(u)}</span>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                    <span>Tunai:</span>
                    <span>Rp ${x($)}</span>
                </div>
                
                ${B>0?`
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                        <span>Kembali:</span>
                        <span>Rp ${x(B)}</span>
                    </div>
                `:""}

                ${I>0?`
                    <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px;">
                        <span>SISA HUTANG:</span>
                        <span>Rp ${x(I)}</span>
                    </div>
                `:""}
            </div>

            <div style="margin-top: 15px; text-align: center; font-size: 10px;">
                <div>Terima Kasih</div>
                <div style="margin-top: 2px;">Barang yang dibeli tidak dapat ditukar/dikembalikan</div>
            </div>
        </div>
    `},De=(e,t,n,s,b,C)=>{const $=Se(e,t,n,s,b,C),u=window.open("","","width=400,height=600");if(!u){i.fire("Error","Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.","error");return}u.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Struk #${e.id.substring(0,8)}</title>
                <style>
                    /* Reset CSS */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: Arial, Helvetica, sans-serif;
                        background: #fff;
                        color: #000;
                    }

                    /* PENTING: CSS Print */
                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        
                        body {
                            width: 100%;
                        }
                    }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 1000);">
                ${$}
            </body>
        </html>
    `),u.document.close()},Ne=async()=>{var C,$;if(!p.value){i.fire("Peringatan","Pelanggan harus dipilih.","warning");return}if(d.value.length===0){i.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!j.value){i.fire("Error","Data kasir/toko belum dimuat. Mohon refresh halaman atau cek koneksi API.","error");return}if(me.value&&!ge.value){i.fire("Peringatan","Toko harus dipilih untuk melakukan penjualan.","warning");return}if(!(await i.fire({icon:"question",title:"Konfirmasi Transaksi",html:`<div class="text-left">
                   <p class="mb-3"><strong>Total Belanja:</strong> ${r(w.value)}</p>
                   <p class="mb-3"><strong>Uang Bayar:</strong> ${r(g.value)}</p>
                   <p class="mb-4"><strong>Kembalian/Hutang:</strong> <span class="${P.value<0?"text-red-600 font-bold ":"text-green-600 font-bold"}">${r(Math.abs(P.value))}</span></p>
                   <hr class="my-3">
                   <p class="text-sm text-gray-600">Periksa kembali data di atas sebelum melanjutkan.</p>
               </div>`,showCancelButton:!0,confirmButtonText:"Ya, Lanjutkan",cancelButtonText:"Batalkan",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return;const t=P.value;if(t<0){const u=Math.abs(t);if(!(await i.fire({icon:"warning",title:"Kurang Bayar!",html:`<p>Pembayaran <strong>kurang</strong> sebesar <strong>${r(u)}</strong>.</p>
                   <p class="mt-2 text-red-500 font-semibold">Transaksi ini akan dicatat sebagai <strong>Hutang</strong>.</p>
                   <p class="text-sm mt-3">Lanjutkan proses transaksi?</p>`,showCancelButton:!0,confirmButtonText:"Ya, Catat Hutang",cancelButtonText:"Batalkan Transaksi",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return}const n=[...d.value],s=d.value.map(u=>({barcode:u.barcode,qty:u.qty})),b={pelanggan_id:p.value,pembayaran:g.value,items:s};z.value=!0;try{const u=await M.post(`${N}/transaksi/create/ritel`,b,{headers:A()});if(u.data.success){const B=u.data.data.transaksi,I=B.sisa_hutang||0,x=B.total_kembalian||0,y=u.data.data.pelanggan.nama_pelanggan;De(B,y,n,j.value.full_name,j.value.toko.nama_toko,j.value.toko.alamat);let H,q,K;I>0?(K="warning",H="Transaksi Tercatat sebagai Hutang!",q=`<p class="text-lg font-bold mt-2">Pelanggan: ${y}</p>
                   <p class="text-xl font-bold mt-1 text-red-600">Sisa Hutang: ${r(I)}</p>`):I===0?(x>0?(K="success",H="Transaksi Berhasil!",q=`<p class="text-lg font-bold mt-2">Total Belanja: ${r(w.value)}</p>
                       <p class="text-lg font-bold mt-1">Uang Bayar: ${r(g.value)}</p>
                       <p class="text-xl font-bold mt-2 text-green-600">Kembalian: ${r(x)}</p>`):(K="success",H="Transaksi Berhasil!",q='<p class="text-lg font-bold mt-2">Pembayaran Lunas Pas!</p>'),ue.push("/penjualan-grosir")):(K="error",H="Error Logika Transaksi!",q='<p class="text-lg font-bold mt-2">Terdeteksi error internal. Hubungi Admin.</p>'),i.fire({icon:K,title:H,html:q,confirmButtonText:"OK",confirmButtonColor:"#0891b2",allowOutsideClick:!1,allowEscapeKey:!1,didOpen:()=>{const Z=document.querySelector(".swal2-confirm");Z&&Z.focus()}}).then(Z=>{T.value!==null&&X(T.value,!1),se(p.value),Q()})}else i.fire({icon:"error",title:"Transaksi Gagal",text:u.data.message||"Terjadi kesalahan saat memproses transaksi."})}catch(u){console.error("Error transaksi:",u),i.fire({icon:"error",title:"Error",text:(($=(C=u.response)==null?void 0:C.data)==null?void 0:$.message)||"Gagal terhubung ke server."})}finally{z.value=!1}},ze=async e=>{const t=await i.fire({title:"Jumlah Barang",html:`
            <p class="mb-3 text-gray-700 font-medium">${e.nama_produk}</p>
            <input id="qty-input" type="number" min="1" value="1" 
                class="swal2-input w-full text-center text-lg font-bold text-gray-800" 
                autofocus>
        `,showCancelButton:!0,confirmButtonText:"Tambahkan",cancelButtonText:"Batal",confirmButtonColor:"#0891b2",cancelButtonColor:"#6b7280",allowOutsideClick:!1,didOpen:()=>{const n=document.getElementById("qty-input");n&&(n.focus(),n.select(),n.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),i.clickConfirm())}))},preConfirm:()=>{const n=document.getElementById("qty-input"),s=parseInt(n.value);return!s||s<=0||isNaN(s)?(i.showValidationMessage("Masukkan jumlah yang valid (minimal 1)"),!1):s}});return t.isConfirmed&&t.value?t.value:null};return Ee(async()=>{var e;await Be(),await Te(),Ce(),(e=L.value)==null||e.focus()}),(e,t)=>(c(),He(Ve,null,{default:qe(()=>[a("div",Ue,[a("div",Ge,[a("div",Ye,[t[3]||(t[3]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Cari Produk ",-1)),ee(a("input",{onKeypress:ve,ref_key:"barcodeInputRef",ref:L,"onUpdate:modelValue":t[0]||(t[0]=n=>R.value=n),type:"text",style:{"font-size":"12px"},placeholder:"Ketik nama produk...",onInput:t[1]||(t[1]=n=>ke(R.value)),onKeydown:_e,disabled:Ke(ce)!=="admin",class:"input-field w-full h-8 px-4 rounded-lg transition"},null,40,Je),[[re,R.value]]),_.value&&f.value.length>0?(c(),m("div",We,[(c(!0),m(V,null,O(f.value,(n,s)=>(c(),m("div",{key:n.barcode,onClick:b=>ne(n),class:D([s===v.value?"dropdown-item-active":"dropdown-item","px-2 py-1 cursor-pointer last:border-b-0 transition"])},[a("div",Xe,[a("div",Ze,o(n.nama_produk),1),a("div",et,o(r(n.harga_jual_ritel)),1)])],10,Qe))),128))])):S("",!0)]),a("div",null,[t[5]||(t[5]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Pilih Pelanggan ",-1)),ee(a("select",{"onUpdate:modelValue":t[2]||(t[2]=n=>p.value=n),required:"",style:{"font-size":"12px"},class:"input-field w-full h-8 rounded-lg px-4 transition"},[t[4]||(t[4]=a("option",{value:"",disabled:""},"Pilih Pelanggan...",-1)),Y.value?(c(),m("option",tt,"Memuat...")):S("",!0),(c(!0),m(V,null,O(G.value,n=>(c(),m("option",{key:n.id,value:n.id},o(n.nama_pelanggan),9,at))),128))],512),[[Me,p.value]])])]),p.value?(c(),m("div",nt,[a("div",st,[t[6]||(t[6]=a("span",{class:"text-sm font-medium text-muted"},"Hutang Pelanggan",-1)),a("span",{class:D(["text-lg",k.value>0?"text-danger":"text-success"])},o(r(k.value)),3)])])):S("",!0),h.value.length>0?(c(),m("div",lt,[a("div",ot,[t[7]||(t[7]=a("div",{class:"w-1 h-6 indicator-bar rounded"},null,-1)),a("p",rt," Transaksi Pending ("+o(h.value.length)+") ",1)]),a("div",it,[(c(!0),m(V,null,O(h.value,n=>(c(),m("div",{key:n.id,class:D(["p-4 border-2 rounded-lg transition cursor-pointer pending-card",n.id===T.value?"pending-card-active":"pending-card-inactive"])},[a("div",dt,[a("p",ut,o(n.nama_pelanggan),1),a("p",ct,o(r(n.total)),1),a("p",pt,o(n.tanggal_simpan),1)]),a("div",mt,[a("button",{onClick:s=>Ie(n),class:"btn-primary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Muat ",8,gt),a("button",{onClick:s=>X(n.id),class:"btn-secondary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Hapus ",8,vt)])],2))),128))])])):S("",!0),a("div",ft,[a("div",bt,[a("table",yt,[t[10]||(t[10]=a("thead",null,[a("tr",{class:"table-header border-b"},[a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"No"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"Produk"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"},"Qty"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Harga"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Subtotal"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"})])],-1)),a("tbody",ht,[d.value.length===0?(c(),m("tr",xt,t[8]||(t[8]=[a("td",{colspan:"6",class:"px-6 py-12 text-center text-muted-light"},[a("div",{class:"space-y-2"},[a("svg",{class:"w-12 h-12 mx-auto opacity-40",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.5",d:"M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"})]),a("p",{class:"text-sm"},"Belum ada produk ditambahkan")])],-1)]))):S("",!0),(c(!0),m(V,null,O(d.value,(n,s)=>(c(),m("tr",{key:n.barcode,class:"table-row-hover transition"},[a("td",kt,o(s+1),1),a("td",_t,[a("div",wt,o(n.nama_produk),1)]),a("td",Bt,[ee(a("input",{"onUpdate:modelValue":b=>n.qty=b,type:"number",min:"1",onChange:b=>Pe(n.barcode,n.qty),class:"input-qty w-20 text-center border rounded-md px-2 py-1 text-sm transition"},null,40,Tt),[[re,n.qty,void 0,{number:!0}]])]),a("td",jt,o(r(n.harga_jual_ritel)),1),a("td",Pt,o(r(n.qty*n.harga_jual_ritel)),1),a("td",Ct,[a("button",{type:"button",onClick:b=>le(n.barcode),class:"btn-icon-delete p-1.5 rounded-md transition"},t[9]||(t[9]=[a("svg",{width:"18",height:"18",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,$t)])]))),128))])])]),a("div",It,[t[11]||(t[11]=a("span",{class:"text-base text-muted-dark"},"Total Belanja",-1)),a("span",St,o(r(w.value)),1)])]),a("div",Dt,[a("div",null,[t[13]||(t[13]=a("label",{class:"block text-sm font-medium label-text mb-2"},[te(" Jumlah Bayar "),a("span",{class:"text-danger"},"*")],-1)),a("div",Nt,[t[12]||(t[12]=a("span",{class:"absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted"},"Rp",-1)),a("input",{ref_key:"pembayaranInputRef",ref:ae,value:E.value||g.value||"",onInput:be,onFocus:ye,onBlur:he,onKeydown:Le(xe,["enter"]),type:"text",required:"",placeholder:"0",class:"input-field w-full h-10 pl-12 pr-4 rounded-lg border text-sm transition"},null,40,zt)])]),a("div",Rt,[a("div",At,[t[14]||(t[14]=a("span",{class:"text-muted"},"Hutang Lama:",-1)),a("span",{class:D(["font-semibold",k.value>0?"text-danger":"text-success"])},o(r(k.value)),3)]),a("div",Et,[t[15]||(t[15]=a("span",{class:"text-muted"},"Total Belanja:",-1)),a("span",Ht,o(r(w.value)),1)]),a("div",{class:D(["flex justify-between text-base border-t pt-3 border-divider",J.value>0?"text-orange-custom":"text-body"])},[t[16]||(t[16]=a("span",null,"Total yang Harus Dibayar:",-1)),a("span",null,o(r(J.value)),1)],2),a("div",qt,[t[17]||(t[17]=a("span",{class:"text-muted"},"Uang Bayar:",-1)),a("span",Kt,o(r(g.value)),1)]),a("div",{class:D(["flex justify-between text-base border-t pt-3 border-divider",P.value>=0?"text-success":"text-danger"])},[a("span",null,o(P.value>=0?"Kembalian":"Sisa Hutang"),1),a("span",null,o(r(Math.abs(P.value))),1)],2)])]),a("div",Mt,[a("button",{ref_key:"submitButtonRef",ref:W,type:"submit",onClick:ie(Ne,["prevent"]),disabled:z.value||w.value===0||!p.value,class:"md:col-span-2 h-12 btn-submit text-base font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition transform hover:scale-[1.01]"},[z.value?(c(),m("svg",Ft,t[18]||(t[18]=[a("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),a("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)]))):S("",!0),te(" "+o(z.value?"Memproses...":"Proses Transaksi"),1)],8,Lt),a("button",{type:"button",onClick:ie($e,["prevent"]),disabled:d.value.length===0||!p.value,class:"btn-pending h-12 font-medium rounded-lg flex items-center justify-center gap-2 transition"},t[19]||(t[19]=[a("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})],-1),te(" Simpan (Pending) ")]),8,Vt)])])]),_:1}))}}),Qt=Oe(Ot,[["__scopeId","data-v-18e52d30"]]);export{Qt as default};
